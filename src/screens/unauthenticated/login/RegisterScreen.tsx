import { Button, Header, HStack } from '@/components';
import useHeader from '@/hooks/useHeader';
import { useRegisterMutation } from '@/store/apiSlice';
import theme from '@/theme';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { toast } from 'sonner-native';


const RegisterHeader = () => {
    return (
        <Header >
            <HStack>
                <Header.BackAction />
                <Header.Content title="Register" />
            </HStack>
        </Header>
    );
};

const RegisterScreen = () => {
    useHeader(RegisterHeader);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigation = useNavigation();
    const [register, { isLoading }] = useRegisterMutation();

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            toast.warning('Please fill in all fields.');
            return;
        }
        if (password !== confirmPassword) {
            toast.warning('Passwords do not match.');
            return;
        }

        try {
            const payload = await register({ email, name, password }).unwrap();
            toast.success('Registration successful!');
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            navigation.navigate('Login');

        } catch (error: any) {
            toast.error(error?.data?.message || 'Something went wrong!');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register Your Account</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            <Button width={'100%'} onPress={() => handleRegister()} loading={isLoading}>
                < Button.Text title="Register" />
            </Button>
        </View>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: theme.colors.primary,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginVertical: 10,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#6200ea',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
