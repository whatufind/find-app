import React, {useState} from 'react';
import {
  Box,
  Button,
  ContentSafeAreaView,
  FastImage,
  Input,
  Screen,
  Text,
  VStack,
} from '@/components';
import theme from '@/theme';
import {getImage} from '@assets/constants/images';
import {toast} from 'sonner-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import { useChangePasswordMutation } from '@/store/apiSlice';

const ConfirmResetPassScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const email = route.params?.email || ''; // get email from navigation

  console.log(email,'what is email');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [changePassword, {isLoading, isError, error, isSuccess}] =
    useChangePasswordMutation();

  const handleSubmit = async () => {
    if (!token || !password) {
      toast.error('Please provide all fields');
      return;
    }

    try {
      const res = await changePassword({email, password, token}).unwrap();
      if (res) {
        toast.success('Password changed successfully');
        navigation.navigate('Login'); // or wherever you want
      }
    } catch (err) {
        console.log(err);
      toast.error('Failed to reset password');
    }
  };

  return (
    <Screen safeAreaEdges={['top']} background="white">
      <ContentSafeAreaView mt={10}>
        <Box alignItems="center" mt={10}>
          <FastImage
            width={theme.sizes.safeWidth / 3}
            height={theme.sizes.safeWidth / 3}
            source={getImage('logo')}
          />
        </Box>

        <VStack mt={8}>
          <Text variant="heading3">Confirm Reset</Text>
          <Text variant="heading3">Password</Text>
        </VStack>

        <VStack mt={5}>
          <Text>New Password</Text>
          <Input
            placeholder="Enter new password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </VStack>

        <VStack mt={4}>
          <Text>OTP Token</Text>
          <Input
            placeholder="Enter the token sent to email"
            value={token}
            onChangeText={setToken}
            keyboardType="number-pad"
            autoCapitalize="none"
          />
        </VStack>

        <Button mt={5} onPress={handleSubmit} disabled={isLoading}>
          <Button.Text title={isLoading ? 'Submitting...' : 'Change Password'} />
        </Button>

        {isError && (
          <Text color="danger" mt={2}>
            {error?.data?.message || 'Something went wrong.'}
          </Text>
        )}
      </ContentSafeAreaView>
    </Screen>
  );
};

export default ConfirmResetPassScreen;
