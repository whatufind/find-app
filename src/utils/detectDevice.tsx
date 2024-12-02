import { Dimensions, PixelRatio, Platform } from 'react-native';

export interface IDetectDevice {
    isAndroid: boolean;
    isIOS: boolean;
    isTablet: boolean;
}

const { width, height } = Dimensions.get('window');

const isTablet = (): boolean => {
    const pixelDensity = PixelRatio.get();
    const adjustedWidth = width * pixelDensity;
    const adjustedHeight = height * pixelDensity;
    if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
        return true;
    }
    return pixelDensity === 2 && (adjustedWidth >= 1824 || adjustedHeight >= 1824);
};

export const detectDevice: IDetectDevice = {
    isAndroid: Platform.OS === 'android',
    isIOS: Platform.OS === 'ios',
    isTablet: isTablet(),
};

export default detectDevice;
