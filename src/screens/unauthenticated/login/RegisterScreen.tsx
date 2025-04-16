import {
  Box,
  Button,
  Clickable,
  ContentSafeAreaView,
  HStack,
  IconButton,
  Input,
  Screen,
  Text,
  VStack,
} from '@/components';
import { useSafeAreaInsetsStyle } from '@/hooks/useSafeAreaInsetsStyle';
import { useRegisterMutation } from '@/store/apiSlice';
import theme from '@/theme';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { s } from 'react-native-size-matters';
import { toast } from 'sonner-native';
import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
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
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {name: '', email: '', password: '', confirmPassword: ''}, // Prevents extra renders
  });

  const handleRegister = async data => {
    try {
      const {confirmPassword, ...rest} = data;
      const response = await register(rest).unwrap();
      if (response) {
        toast.success('Successfully registered');
        reset();
        navigation.navigate('Login');
      }
    } catch (err) {
      const errorMessage =
        err?.message ||
        err?.data?.message ||
        "Can't register, please try again.";
      toast.error(errorMessage);
    }
  };

  const buttonLabel = useMemo(
    () => (isLoading ? 'Registering...' : 'Register'),
    [isLoading],
  );

  return (
      <LinearGradient colors={[theme.colors.white,theme.colors.black100]} style={{flex:1}}>
    <Screen background="transparent" safeAreaEdges={['top']}  >
      <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor={theme.colors.transparent}
      />
    <ContentSafeAreaView flex={1} mt={10} >
      <Box>
      <Box
          alignSelf="center"
          width={s(100)}
          height={s(100)}
          bg="primary"
          alignItems="center"
          justifyContent="center"
          borderRadius="rounded-full">
          <Text fontSize={s(50)} fontWeight="700" color="white">
            WF
          </Text>
        </Box>

        <Text textAlign="center" variant="heading2">
          Register Your Account
        </Text>

        {/* Name Input */}
        <Box mt={4} g={4}>
          <Text>Name</Text>
          <Controller
            control={control}
            name="name"
            render={({field: {onChange, value}}) => (
              <Input
                size="sm"
                placeholder="Name"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors?.name && <Text color="danger">{errors.name.message}</Text>}
        </Box>

        {/* Email Input */}
        <Box mt={4} g={4}>
          <Text>Your Email ID</Text>
          <Controller
            control={control}
            name="email"
            render={({field: {onChange, value}}) => (
              <Input
                size="sm"
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
          {errors?.email && <Text color="danger">{errors.email.message}</Text>}
        </Box>

        {/* Password Input */}
        <Box mt={4} g={4}>
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
          {errors?.password && (
            <Text color="danger">{errors.password.message}</Text>
          )}
        </Box>

        {/* Confirm Password Input */}
        <Box mt={4} g={4}>
          <Text>Confirm Password</Text>
          <Controller
            control={control}
            name="confirmPassword"
            render={({field: {onChange, value}}) => (
              <Input
                size="sm"
                placeholder="Confirm Password"
                value={value}
                onChangeText={onChange}
                secureTextEntry={!showPass}
              />
            )}
          />
          {errors?.confirmPassword && (
            <Text color="danger">{errors.confirmPassword.message}</Text>
          )}
        </Box>

        {/* Register Button */}
        <Button
          mt={5}
          disabled={isLoading}
          onPress={handleSubmit(handleRegister)}>
          <Button.Text title={buttonLabel} />
        </Button>

        {/* Navigation to Login */}
        <VStack mt={5} alignItems="center">
          <HStack>
            <Text>Already have an account? </Text>
            <Clickable onPress={() => navigation.navigate('Login')}>
              <Text color="primary" fontWeight="700">
                Login Here
              </Text>
            </Clickable>
          </HStack>
        </VStack>
      </Box>
      </ContentSafeAreaView>
    </Screen>
    </LinearGradient>
  );
};

export default RegisterScreen;
