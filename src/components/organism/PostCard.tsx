import { StyleSheet, View } from 'react-native';
import React, { FC, useState } from 'react';
import Card from '../ui/layout/Card';
import FastImage from '../ui/media-icons/FastImage';
import theme from '@/theme';
import HStack from '../ui/layout/HStack';
import { Box } from '../ui/layout/Box';
import { Text } from '../ui/typography/Text';
import Divider from '../ui/layout/Divider';
import { backgroundColor } from '@shopify/restyle';
import Icon from '../ui/media-icons/Icon';
import { TouchableOpacity } from 'react-native';

type PostCardProps = {
    post: any
}

export const PostCard: FC<PostCardProps> = ({ post }) => {
    const [iconSize, setIconSize] = useState(7);
    return (
        <Card variant="elevated" marginHorizontal={2} padding={5} >
            <HStack>
                <FastImage width={35} height={35} style={{ borderRadius: theme.borderRadii['rounded-full'] }} source={{ uri: 'https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png' }} />
                <Box>
                    <Text>Ibrahim Khan</Text>
                    <Text variant="b5regular">14 minutes ago</Text>
                </Box>
            </HStack>
            <Box mb={5}>
                <Text variant="b2regular" mt={4}>{post?.content}</Text>
            </Box>
            <HStack >
                <FastImage width={20} height={20} source={{ uri: 'https://cdn.iconscout.com/icon/free/png-256/free-like-icon-download-in-svg-png-gif-file-formats--love-emoji-logo-facebook-reaction-pack-sign-symbols-icons-1991059.png' }} />
                <FastImage width={20} height={20} source={{ uri: 'https://freepngimg.com/thumb/emoji/64977-emoticon-heart-facebook-love-emoji-free-photo-png-thumb.png' }} />
                <FastImage width={20} height={20} source={{ uri: 'https://static.vecteezy.com/system/resources/previews/011/380/317/non_2x/wow-and-shocked-emoji-free-png.png' }} />

            </HStack>
            <Divider mb={5} mt={2} borderWidth={0.4} />
            <HStack justifyContent="space-between">
                <TouchableOpacity onLongPress={() => setIconSize(10)}
                    onPressOut={() => setIconSize(7)}
                >
                    <Icon variant="vector" type="ant" icon="like2" size={iconSize} />
                </TouchableOpacity>
                <Icon variant="vector" type="evil" icon="comment" />
                <Icon variant="vector" type="materialCommunity" icon="share-outline" />
            </HStack>

        </Card>
    );
};

export default PostCard;

const styles = StyleSheet.create({});
