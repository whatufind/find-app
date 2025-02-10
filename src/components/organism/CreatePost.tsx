import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import FastImage from 'react-native-fast-image';
import {launchImageLibrary} from 'react-native-image-picker';
import {Input} from '../ui/forms/Input';
import ContentSafeAreaView from '../ui/layout/ContentSafeAreaView';
import {Text} from '../ui/typography/Text';
import IconButton from '../ui/media-icons/IconButton';
import {Box} from '../ui/layout/Box';
import {Button} from '../ui/forms/Button';
import {useCreatePostMutation} from '@/store/apiSlice';
import {toast} from 'sonner-native';
import {useNavigation} from '@react-navigation/native';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<
    {uri: string; type: string; name: string}[]
  >([]);
  const [createPost, {isLoading}] = useCreatePostMutation();
  const navigation = useNavigation();
  const handleChooseMedia = () => {
    const options = {
      mediaType: 'photo', // 'photo', 'video', or 'mixed'
      selectionLimit: 0, // 0 for unlimited selection
    };

    launchImageLibrary(options, response => {
      if (response.errorCode) {
        console.error('ImagePicker Error:', response.errorMessage);
      } else {
        const files = response.assets?.map(asset => ({
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName,
        }));

        if (files) {
          setMedia(prevMedia => [...prevMedia, ...files]);
        }
      }
    });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('content', content);

    // Append media files
    media.forEach(file => {
      formData.append('images', file);
    });

    try {
      await createPost(formData).unwrap();
      toast.success('Post created successfully');
    } catch (error) {
      if (error?.data?.code === 401) {
        navigation.navigate('Login');
        return;
      }
      toast.error(error?.data?.message || "Couldn't create post");
    }
  };

  return (
    <ContentSafeAreaView gap={5}>
      <Text variant="heading2" mb={2} mt={5} textAlign="center">
        Create Post
      </Text>
      <Input placeholder="Content" value={content} onChangeText={setContent} />

      <Button
        alignSelf="flex-start"
        paddingHorizontal={5}
        type="outlined"
        onPress={handleChooseMedia}>
        <Button.Icon
          variant="vector"
          color="primary"
          type="feather"
          icon="image"
        />
        <Button.Text title="Choose media" />
      </Button>

      {/* Display media */}
      <Box flexDirection="row" flexWrap="wrap" gap={4} mt={4}>
        {media.map((file, index) => (
          <Box key={index}>
            <IconButton
              onPress={() =>
                setMedia(prevMedia => prevMedia.filter((_, i) => i !== index))
              }
              type="ant"
              icon="closecircle"
              color="danger"
              variant="vector"
            />
            <FastImage
              source={{uri: file.uri}}
              style={styles.mediaPreview}
              resizeMode={FastImage.resizeMode.cover}
            />
          </Box>
        ))}
      </Box>

      <Button
        mt={5}
        mb={5}
        paddingHorizontal={5}
        onPress={handleSubmit}
        disabled={isLoading}>
        <Button.Text title={isLoading ? 'Creating...' : 'Create Post'} />
      </Button>
    </ContentSafeAreaView>
  );
};

export default CreatePost;

const styles = StyleSheet.create({
  mediaPreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  deleteIcon: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
});
