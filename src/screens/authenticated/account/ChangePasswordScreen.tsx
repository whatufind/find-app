import {
    Box,
    Button,
    Clickable,
    HStack,
    IconButton,
    Input,
    Screen,
    Text,
    VStack,
} from '@/components';
import { useSafeAreaInsetsStyle } from '@/hooks/useSafeAreaInsetsStyle';
import { useChangePasswordMutation } from '@/store/apiSlice';
import { AppDispatch, RootState } from '@/store/store';
import theme from '@/theme';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StatusBar } from 'react-native';
import { s } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner-native';
import * as yup from 'yup';

// Validation Schema
const schema = yup.object().shape({
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
});

const ChangePasswordScreen = () => {
    const safeAreaInsets = useSafeAreaInsetsStyle(['top']);
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();

    const { accessToken } = useSelector((state: RootState) => state.user);

    const [changePassword, { isLoading }] = useChangePasswordMutation();
    const [showPass, setShowPass] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const handleChangePassword = async (data: { password: string }) => {
        try {
            console.log(accessToken);
            const response = await changePassword({
                password: data.password,
                token:accessToken, // Pass refreshToken as query param
            }).unwrap();

            if (response) {
                toast.success('Password changed successfully');
                navigation.goBack();
            }
        } catch (err) {
            console.log(err);
            const errorMessage =
                err?.message || err?.data?.message || "Can't change password, please try again.";
            toast.error(errorMessage);
        }
    };

    return (
        <Screen background="primary">
            <StatusBar barStyle="light-content" translucent backgroundColor={theme.colors.primary} />
            <Box style={safeAreaInsets} />
            <Box flex={1} justifyContent="center">
                <Box flex={1} alignItems="center" justifyContent="center">
                    <Box
                        alignSelf="center"
                        width={s(100)}
                        height={s(100)}
                        bg="white"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="rounded-full">
                        <Text fontSize={s(50)} fontWeight="700" color="primary">
                            WF
                        </Text>
                    </Box>
                </Box>
                <Box flex={2} bg="white" paddingTop={10} borderTopLeftRadius="rounded-hu" px={5} borderTopRightRadius="rounded-hu">
                    <Text textAlign="center" variant="heading2" mb={5}>Change Password</Text>

                    {/* New Password Field */}
                    <Box g={3}>
                        <Text color="black">Your New Password</Text>
                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    size="sm"
                                    placeholder="Your New Password"
                                    value={value}
                                    onChangeText={onChange}
                                    secureTextEntry={!showPass}
                                    right={() => (
                                        <IconButton
                                            onPress={() => setShowPass(!showPass)}
                                            icon={showPass ? 'eye' : 'eye-off'}
                                            variant="vector"
                                            type="feather"
                                        />
                                    )}
                                />
                            )}
                        />
                        <Text color="danger">{errors?.password?.message}</Text>
                    </Box>

                    {/* Confirm Password Field */}
                    <Box mt={3}>
                        <Text color="black">Confirm Your Password</Text>
                        <Controller
                            control={control}
                            name="confirmPassword"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    size="sm"
                                    placeholder="Confirm Your Password"
                                    value={value}
                                    onChangeText={onChange}
                                    secureTextEntry={!showPass}
                                />
                            )}
                        />
                        <Text color="danger">{errors?.confirmPassword?.message}</Text>
                    </Box>

                    {/* Submit Button */}
                    <Button
                        mt={5}
                        disabled={isLoading}
                        onPress={handleSubmit(handleChangePassword)}>
                        <Button.Text title={isLoading ? 'Saving...' : 'Save'} />
                    </Button>

                </Box>
            </Box>
        </Screen>
    );
};

export default ChangePasswordScreen;
