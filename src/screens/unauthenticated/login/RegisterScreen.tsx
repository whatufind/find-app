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
import { useRegisterMutation } from '@/store/apiSlice';
import { AppDispatch } from '@/store/store';
import theme from '@/theme';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StatusBar } from 'react-native';
import { s } from 'react-native-size-matters';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner-native';
import * as yup from 'yup';

  const schema = yup.object().shape({
    name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
    email: yup.string().email('Please enter a valid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const RegisterScreen = () => {
    const safeAreaInsets = useSafeAreaInsetsStyle(['top']);
    const navigation = useNavigation();
    const [register, {isLoading}] = useRegisterMutation();
    const [showPass, setShowPass] = useState(false);

    const {
      control,
      handleSubmit,
      formState: {errors},
    } = useForm({
      resolver: yupResolver(schema),
    });

    const handleRegister = async data => {
      try {
        const {confirmPassword,...rest} = data;
        const response = await register(rest).unwrap();
        if (response) {
          toast.success('Successfully registered');
          navigation.navigate('Login');
        }
      } catch (err) {
        const errorMessage = err?.message || err?.data?.message || "Can't register, please try again.";
        toast.error(errorMessage);
      }
    };

    return (
      <Screen background="white">
        <StatusBar barStyle="light-content" translucent backgroundColor={theme.colors.primary} />
        <Box style={safeAreaInsets} bg="primary" />
        <Box flex={1} justifyContent="center" bg="primary">
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
          <Box
            flex={2}
            bg="white"
            paddingTop={10}
            borderTopLeftRadius="rounded-hu"
            px={5}
            borderTopRightRadius="rounded-hu">
            <Text textAlign="center" variant="heading2">
              Register Your Account
            </Text>
            <Box g={3}>
              <Text>Name</Text>
              <Controller
                control={control}
                name="name"
                render={({field: {onChange, value}}) => (
                  <Input size="sm" placeholder="Name" value={value} onChangeText={onChange} />
                )}
              />
              <Text color="danger">{errors?.name?.message}</Text>
            </Box>
            <Box g={3}>
              <Text>Your Email Id</Text>
              <Controller
                control={control}
                name="email"
                render={({field: {onChange, value}}) => (
                  <Input size="sm" placeholder="Email" value={value} onChangeText={onChange} keyboardType="email-address" autoCapitalize="none" />
                )}
              />
              <Text color="danger">{errors?.email?.message}</Text>
            </Box>
            <Box>
              <Text>Password</Text>
              <Controller
                control={control}
                name="password"
                render={({field: {onChange, value}}) => (
                  <Input
                    size="sm"
                    placeholder="Password"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={!showPass}
                    right={() => (
                      <IconButton onPress={() => setShowPass(!showPass)} icon={showPass ? 'eye' : 'eye-off'} variant="vector" type="feather" />
                    )}
                  />
                )}
              />
              <Text color="danger">{errors?.password?.message}</Text>
            </Box>
            <Box>
              <Text>Confirm Password</Text>
              <Controller
                control={control}
                name="confirmPassword"
                render={({field: {onChange, value}}) => (
                  <Input size="sm" placeholder="Confirm Password" value={value} onChangeText={onChange} secureTextEntry={!showPass} />
                )}
              />
              <Text color="danger">{errors?.confirmPassword?.message}</Text>
            </Box>
            <Button mt={5} disabled={isLoading} onPress={handleSubmit(handleRegister)}>
              <Button.Text title={isLoading ? 'Registering...' : 'Register'} />
            </Button>
            <VStack mt={5}>
              <HStack g={2}>
                <Text>Already have an account?</Text>
                <Clickable onPress={() => navigation.navigate('Login')}>
                  <Text color="primary" fontWeight="700">
                    Login Here
                  </Text>
                </Clickable>
              </HStack>
            </VStack>
          </Box>
        </Box>
      </Screen>
    );
  };

  export default RegisterScreen;
