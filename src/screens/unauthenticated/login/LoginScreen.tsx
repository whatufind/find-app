import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ToastAndroid,
} from 'react-native';
import { useLoginMutation } from '@/store/apiSlice'; // Import the login mutation
import { toast } from 'sonner-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { setUser } from '@/store/slice/userSlice';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const [login, { isLoading }] = useLoginMutation(); // Call login mutation
    const validateEmail = (email) => {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 6; // Password should be at least 6 characters
    };

    const handleLogin = async () => {
        // Reset previous errors
        setEmailError('');
        setPasswordError('');

        let isValid = true;

        // Email Validation
        if (!email) {
            setEmailError('Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            setEmailError('Please enter a valid email');
            isValid = false;
        }

        // Password Validation
        if (!password) {
            setPasswordError('Password is required');
            isValid = false;
        } else if (!validatePassword(password)) {
            setPasswordError('Password must be at least 6 characters');
            isValid = false;
        }

        if (!isValid) { return; } // If validation fails, stop here

        try {
            // Call the login API
            const response = await login({ email, password }).unwrap();

            if (response) {
                const { tokens, user } = response; // Destructure the tokens and user data from the response

                // Dispatch the setUser action with the necessary data
                dispatch(setUser({
                    userId: user.id,
                    userName: user.name,
                    accessToken: tokens.access.token,
                    refreshToken: tokens.refresh.token,
                }));

                toast.success('Successfully logged in');
            }
        } catch (err) {
            // Show server error using Toast
            const errors = err?.message || err?.data?.message;
            const errorMessage = errors || "Can't login, please try again.";
            toast.error(errorMessage);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <View style={styles.logoContainer}>
                {/* Optional: Add your logo here */}
            </View>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Find what you need!</Text>
                <Text style={styles.subtitle}>Please log in to continue</Text>

                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={[styles.input, emailError ? styles.inputError : null]}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    style={[styles.input, passwordError ? styles.inputError : null]}
                    secureTextEntry
                />
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
                    <Text style={styles.buttonText}>{isLoading ? 'Logging in...' : 'Login'}</Text>
                </TouchableOpacity>

                <Text style={styles.forgotPassword}>Forgot your password?</Text>

                <View style={styles.footer}>
                    <Text>Don’t have an account? </Text>
                    <TouchableOpacity>
                        <Text style={styles.signUpText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffffff',
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        flex: 2,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        color: '#007bff',
        textTransform: 'uppercase',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#7c7c7c',
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        backgroundColor: '#f9f9f9',
    },
    inputError: {
        borderColor: 'red',
    },
    button: {
        backgroundColor: '#007bff',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 16,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    forgotPassword: {
        textAlign: 'center',
        color: '#7c7c7c',
        marginTop: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    signUpText: {
        color: '#007bff',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 8,
        textAlign: 'center',
    },
});

export default LoginScreen;
