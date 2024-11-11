import notification from '@assets/icons/notification.svg';
import { FC } from 'react';
import { SvgProps } from 'react-native-svg';

export const icons = {
    //put icons here
    notification,
};

export type Icon = keyof typeof icons;

export const getIcon = (iconKey: Icon): FC<SvgProps> => {
    return icons[iconKey];
};
