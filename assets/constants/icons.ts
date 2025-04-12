import notification from '@assets/icons/notification.svg';
import filter from '@assets/icons/filter.svg';
import { FC } from 'react';
import { SvgProps } from 'react-native-svg';

export const icons = {
    //put icons here
    notification,
    filter,
};

export type Icon = keyof typeof icons;

export const getIcon = (iconKey: Icon): FC<SvgProps> => {
    return icons[iconKey];
};
