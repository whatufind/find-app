import {
    createRestyleComponent,
    layout,
    type LayoutProps,
    spacing,
    type SpacingProps,
} from '@shopify/restyle';
import React, { type FC, type ReactElement } from 'react';
import RNFastImage, { type FastImageProps, type Source } from 'react-native-fast-image';

import { type Theme } from '@/theme';

type Props = LayoutProps<Theme> &
    SpacingProps<Theme> &
    FastImageProps & {
        source: Source;
    };

const RestyleComponent = createRestyleComponent<Props, Theme>([layout, spacing], RNFastImage);

export const FastImage: FC<Props> = ({ source, ...rest }): ReactElement => {
    return <RestyleComponent source={source} {...rest} />;
};

export default FastImage;
