import {
  Box,
  Button,
  Clickable,
  ContentSafeAreaView,
  Header,
  HStack,
  IconButton,
  Input,
  Screen,
  Text,
  VStack,
} from '@/components';
import useHeader from '@/hooks/useHeader';
import {useSafeAreaInsetsStyle} from '@/hooks/useSafeAreaInsetsStyle';
import {useLoginMutation} from '@/store/apiSlice';
import {setUser} from '@/store/slice/userSlice';
import {AppDispatch} from '@/store/store';
import theme from '@/theme';
import {yupResolver} from '@hookform/resolvers/yup';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import { StatusBar } from 'react-native';
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
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleLogin = async data => {
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
          }),
        );
        toast.success('Successfully logged in');
        navigation.goBack();
      }
    } catch (err) {
      const errorMessage =
        err?.message || err?.data?.message || "Can't login, please try again.";
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
        <Text textAlign="center" variant="heading2">Login Your Account</Text>
          <Box g={3}>
            <Text color="white">Your Email Id</Text>
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
            <Text color="danger">{errors?.email?.message}</Text>
          </Box>

          <Box>
            <Text g={3}>Your Email Id</Text>
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
                  // eslint-disable-next-line react/no-unstable-nested-components
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
          <Button
            mt={5}
            disabled={isLoading}
            onPress={handleSubmit(handleLogin)}>
            <Button.Text title={isLoading ? 'Logging in...' : 'Login'} />
          </Button>
          <VStack mt={5}>
            <HStack g={2}>
                <Text>Don't Have an account?</Text>
            <Clickable onPress={()=>navigation.navigate('Register')}>
                <Text color="primary" fontWeight="700">Register Here</Text>
            </Clickable>
            </HStack>
          </VStack>
        </Box>
      </Box>
    </Screen>
  );
};

export default LoginScreen;
