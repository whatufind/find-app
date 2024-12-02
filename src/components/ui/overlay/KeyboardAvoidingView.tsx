import React, { type FC, type PropsWithChildren, type ReactElement } from 'react';
import {
    KeyboardAvoidingView as RNKeyboardAvoidingView,
    type KeyboardAvoidingViewProps as RNKeyboardAvoidingViewProps,
    StyleSheet,
} from 'react-native';

import { detectDevice } from '@/utils';

type KeyboardAvoidingViewProps = PropsWithChildren & {
    keyboardOffset?: number;
    KeyboardAvoidingViewProps?: RNKeyboardAvoidingViewProps;
};

export const KeyboardAvoidingView: FC<KeyboardAvoidingViewProps> = ({
    children,
    keyboardOffset = 0,
    KeyboardAvoidingViewProps,
}): ReactElement => {
    return (
        <RNKeyboardAvoidingView
            behavior={detectDevice.isIOS ? 'padding' : 'height'}
            keyboardVerticalOffset={keyboardOffset}
            {...KeyboardAvoidingViewProps}
            style={[styles.keyboardAvoidingViewStyle, KeyboardAvoidingViewProps?.style]}>
            {children}
        </RNKeyboardAvoidingView>
    );
};

export default KeyboardAvoidingView;

const styles = StyleSheet.create({
    keyboardAvoidingViewStyle: {
        flex: 1,
    },
});
