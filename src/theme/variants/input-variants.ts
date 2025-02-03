import {vs} from 'react-native-size-matters';

export const inputVariants = {
  defaults: {
    height: vs(36),
    flexGrow: 1,
    width: 'auto',
    backgroundColor: 'white',
    borderColor: 'secondary200',
    paddingHorizontal: 4,
    color: 'secondary',
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  outline: {
    borderWidth: 1,
    borderColor: 'secondary200',
    borderRadius: 'rounded-xs',
  },
  underlined: {
    borderBottomWidth: 1,
  },
};

export const inputSizeVariants = {
  defaults: {
    height: vs(36),
  },
  default: {
    height: vs(36),
  },
  lg: {
    height: vs(40),
  },
  hu:{
    height:vs(80),
  },
  sm: {
    height: vs(32),
  },
};

export const inputValidationStatus = {
  defaults: {},
  default: {
    borderColor: 'neutral',
  },
  success: {
    borderColor: 'success',
  },
  primary: {
    borderColor: 'primary',
  },
  error: {
    borderColor: 'danger',
  },
  warning: {
    borderColor: 'warning',
  },
  dark: {
    borderColor: 'black',
  },
};
