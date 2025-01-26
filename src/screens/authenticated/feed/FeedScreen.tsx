import React from 'react';
import { Text, View, Image, StyleSheet, FlatList } from 'react-native';
import { Badge, Box, Card, Header, HStack, IconButton } from '@/components';
import useHeader from '@/hooks/useHeader';

export const FeedScreen = () => {

    const HomeHeader = () => (
        <Header>
            <Header.Content title="WF" subTitle="Hi Ibrahim, Good Morning" />
            <HStack>
                <IconButton variant="vector" icon="search" color="white" size={10} type="feather" />
                <Badge content="0" placement="topRight" variant="danger">
                    <IconButton variant="vector" icon="notifications" color="white" size={10} type="ionicon" />
                </Badge>
            </HStack>
        </Header>
    );

    useHeader(HomeHeader);
    const chats = [
        {
            id: 1,
            user: {
                name: 'John Doe',
                profileImage: 'https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png',
            },
            lastMessage: 'Hey, are we still on for tomorrow?',
            timestamp: '2025-01-18T10:30:00Z',
            isRead: false,
        },
        {
            id: 2,
            user: {
                name: 'Jane Smith',
                profileImage: 'https://static.vecteezy.com/system/resources/previews/024/183/525/non_2x/avatar-of-a-man-portrait-of-a-young-guy-illustration-of-male-character-in-modern-color-style-vector.jpg',
            },
            lastMessage: 'Thanks for the update!',
            timestamp: '2025-01-18T09:45:00Z',
            isRead: true,
        },
        {
            id: 3,
            user: {
                name: 'Michael Johnson',
                profileImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK-iSZaY6Gt_DV6AEv2X3vL3rwazD4nqbmJQ&s',
            },
            lastMessage: "Let me know when you're free.",
            timestamp: '2025-01-18T08:15:00Z',
            isRead: false,
        },
        {
            id: 4,
            user: {
                name: 'Emily Davis',
                profileImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK-iSZaY6Gt_DV6AEv2X3vL3rwazD4nqbmJQ&s',
            },
            lastMessage: "Can't wait to see you!",
            timestamp: '2025-01-17T19:20:00Z',
            isRead: true,
        },
        {
            id: 5,
            user: {
                name: 'Daniel Lee',
                profileImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK-iSZaY6Gt_DV6AEv2X3vL3rwazD4nqbmJQ&s',
            },
            lastMessage: 'Let’s catch up soon.',
            timestamp: '2025-01-17T15:50:00Z',
            isRead: false,
        },
    ];

    const renderChatItem = ({ item }) => {
        const formattedTimestamp = new Date(item.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });

        return (
            <Card style={styles.card}>
                <Box flexDirection="row" alignItems="center">
                    <Image source={{ uri: item.user.profileImage }} style={styles.profileImage} />
                    <Box flex={1} marginLeft={10}>
                        <Text style={styles.userName}>{item.user.name}</Text>
                        <Text style={styles.lastMessage} numberOfLines={1}>
                            {item.lastMessage}
                        </Text>
                    </Box>
                    <Box>
                        <Text style={[styles.timestamp, !item.isRead && styles.unread]}>
                            {formattedTimestamp}
                        </Text>
                    </Box>
                </Box>
            </Card>
        );
    };

    return (
        <FlatList
            data={chats}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderChatItem}
            contentContainerStyle={styles.container}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    card: {
        marginBottom: 10,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    lastMessage: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
        textAlign: 'right',
    },
    unread: {
        fontWeight: 'bold',
        color: '#007BFF',
    },
});

export default FeedScreen;
