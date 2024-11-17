import theme, { Theme } from '@/theme';
import { getImage } from '@assets/constants/images';
import { border, BorderProps, createRestyleComponent, LayoutProps, spacingShorthand, SpacingShorthandProps } from '@shopify/restyle';
import React, { FC, useState } from 'react';
import { Image, ImageSourcePropType } from 'react-native';
import { FastImageProps, Source } from 'react-native-fast-image';
import FastImage from './FastImage';

type ScaleHeightLocalProps = {
    source: ImageSourcePropType | string;
    desiredWidth: number;
};

interface RestyleImageBannerProps extends LayoutProps<Theme>, SpacingShorthandProps<Theme>, FastImageProps, BorderProps<Theme> { }

type ImageBannerProps = {
    source?: ImageSourcePropType | string;
    variant?: 'local' | 'remote';
} & RestyleImageBannerProps;

export const scaledHeightLocal = ({ source, desiredWidth }: ScaleHeightLocalProps): number => {
    const { width, height } = Image.resolveAssetSource(source as ImageSourcePropType);
    return (desiredWidth / width) * height;
};

const RestyleImageBanner = createRestyleComponent<RestyleImageBannerProps, Theme>(
    [spacingShorthand, border],
    FastImage
);

export const ImageBanner: FC<ImageBannerProps> = ({
    source = getImage('banner'),
    width = theme.sizes.safeWidth,
    variant = 'local',
    ...rest
}) => {
    const [desiredHeight, setDesiredHeight] = useState<number>(0);
    const desiredWidth = width as number;

    if (variant === 'remote' && typeof source === 'string') {
        Image.getSize(source, (width, height) => {
            setDesiredHeight(desiredWidth / width * height);
        });
    }

    if (variant === 'local') {
        return (
            <RestyleImageBanner
                resizeMode="contain"
                width={width}
                source={source as Source}
                height={scaledHeightLocal({ source, desiredWidth })}
                {...rest}
            />
        );
    }

    return (
        <RestyleImageBanner
            resizeMode="contain"
            width={width}
            source={{ uri: source as string }}
            height={desiredHeight}
            {...rest}
        />
    );
};

export default ImageBanner;

// how to use
{/* <ImageBanner source={'https://static.vecteezy.com/system/resources/previews/003/208/782/non_2x/sale-banner-with-place-for-your-text-illustration-free-vector.jpg'} variant="remote" />
<ImageBanner source={getImage('banner')} /> */}
