import React, {useEffect, useState} from 'react';
import {
  Box,
  Button,
  Card,
  ContentSafeAreaView,
  FastImage,
  Input,
  Screen,
  Text,
  VStack,
} from '@/components';
import theme from '@/theme';
import {getImage} from '@assets/constants/images';
import {useForgetPassMutation} from '@/store/apiSlice';
import {toast} from 'sonner-native';
import { useNavigation } from '@react-navigation/native';

const ResetPasswordScreen = () => {
    const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [forgetPass, {isLoading, isSuccess, isError, error}] =
    useForgetPassMutation();

  const handleSubmit = async () => {
    if (!email) {
      return;
    }
    try {
      const res =  await forgetPass({email}).unwrap();
      console.log(res,'what is re');
      if (res) {
        navigation.navigate('ConfirmResetPass',{email});
        setEmail('');
      }

    } catch (err) {
console.log('err');
    }
  };

  useEffect(() => {
  if (isSuccess) {
    toast.success('An OTP sent to your email', {duration: 2000});
  }
  }, [isSuccess]);

  return (
    <Screen safeAreaEdges={['top']} background="white">
      <ContentSafeAreaView mt={10}>
        <Box alignItems="center" mt={10}>
          <FastImage
            width={theme.sizes.safeWidth / 3}
            height={theme.sizes.safeWidth / 3}
            source={getImage('logo')}
          />
        </Box>

       <Card variant="elevated" padding={3} marginTop={5}>
       <VStack>
          <Text textAlign="center" variant="heading3">Forgot Password!</Text>
        </VStack>

        <Text variant="b4regular" my={5}>
          Don’t worry! It happens. Please enter your email and we'll send you an
          OTP.
        </Text>

        <VStack g={3}>
          <Text>Your Email Address</Text>
          <Input
            placeholder="Your mail address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </VStack>

        <Button  my={5} onPress={handleSubmit} disabled={isLoading || !email}>
          <Button.Text title={isLoading ? 'Sending...' : 'Continue'} />
        </Button>

        {isError && (
          <Text color="danger" mt={2}>
            {error?.data?.message || 'Something went wrong.'}
          </Text>
        )}
       </Card>
      </ContentSafeAreaView>
    </Screen>
  );
};

export default ResetPasswordScreen;
