import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Input } from '../ui/forms/Input';
import ContentSafeAreaView from '../ui/layout/ContentSafeAreaView';
import IconButton from '../ui/media-icons/IconButton';

const CreatePost = () => {
    return (
        <ContentSafeAreaView>
            <Input multiline numberOfLines={100} size="hu"

                style={{
                    height: 200,
                    // textAlignVertical: 'top',
                }}
                variant="underlined" placeholder="Write your thoughts" right={() =>

                    <IconButton variant="vector" borderRadius="rounded-xs" type="entypo" color="primary" icon="image" />


                } />
        </ContentSafeAreaView>
    );
};

export default CreatePost;

const styles = StyleSheet.create({});
