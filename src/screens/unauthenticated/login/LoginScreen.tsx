import React, {useState} from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import {
  Box,
  Button,
  Clickable,
  Input,
  Screen,
  Text,
  VStack,
  HStack,
  IconButton,
} from '@/components';
import {useSafeAreaInsetsStyle} from '@/hooks/useSafeAreaInsetsStyle';
import {useLoginMutation} from '@/store/apiSlice';
import {setUser} from '@/store/slice/userSlice';
import {AppDispatch} from '@/store/store';
import theme from '@/theme';
import {yupResolver} from '@hookform/resolvers/yup';
import {useNavigation} from '@react-navigation/native';
import {Controller, useForm} from 'react-hook-form';
import {s} from 'react-native-size-matters';
import {useDispatch} from 'react-redux';
import {toast} from 'sonner-native';
import * as yup from 'yup';

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginScreen = () => {
  const safeAreaInsets = useSafeAreaInsetsStyle(['top']);
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const [login, {isLoading}] = useLoginMutation();
  const [showPass, setShowPass] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleLogin = async (data: {email: string; password: string}) => {
    try {
      const response = await login(data).unwrap();
      if (response) {
        const {tokens, user} = response;
        dispatch(
          setUser({
            userId: user.id,
            userName: user.name,
            accessToken: tokens.access.token,
            refreshToken: tokens.refresh.token,
            profilePicture: user?.profilePicture,
          }),
        );
        toast.success('Successfully logged in', {duration: 2000});
        reset();
        navigation.navigate('Home');
      }
    } catch (err) {
      const errorMessage =
        err?.message || err?.data?.message || "Can't login, please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.primary}}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor={theme.colors.primary}
      />
      <Box flex={1} alignItems="center" justifyContent="center">
        <Box
          bg="white"
          width="90%"
          maxWidth={400}
          p={5}
          borderRadius="rounded-sm">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Box style={safeAreaInsets} />
              {/* Logo */}
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

              {/* Login Form */}
              <Text textAlign="center" variant="heading2" mb={5}>
                Login Your Account
              </Text>

              {/* Email Input */}
              <Box marginBottom={4}>
                <Text color="black">Your Email Id</Text>
                <Controller
                  control={control}
                  name="email"
                  render={({field: {onChange, value}}) => (
                    <Input
                      size="sm"
                      placeholder="Enter Your Email"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  )}
                />
                {errors.email && (
                  <Text color="danger">{errors.email.message}</Text>
                )}
              </Box>

              {/* Password Input */}
              <Box marginBottom={4}>
                <Text>Your Password</Text>
                <Controller
                  control={control}
                  name="password"
                  render={({field: {onChange, value}}) => (
                    <Input
                      size="sm"
                      placeholder="Enter Your Password"
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
                {errors.password && (
                  <Text color="danger">{errors.password.message}</Text>
                )}
              </Box>

              {/* Login Button */}
              <Button
                mt={5}
                disabled={isLoading}
                onPress={handleSubmit(handleLogin)}>
                <Button.Text title={isLoading ? 'Logging in...' : 'Login'} />
              </Button>

              {/* Register Link */}
              <VStack mt={5}>
                <HStack g={2}>
                  <Text>Don't have an account?</Text>
                  <Clickable onPress={() => navigation.navigate('Register')}>
                    <Text color="primary" fontWeight="700">
                      Register Here
                    </Text>
                  </Clickable>
                </HStack>
              </VStack>
            </ScrollView>
          </KeyboardAvoidingView>
        </Box>
      </Box>
    </SafeAreaView>
  );
};

export default LoginScreen;
