export const inputVariants = {
  defaults: {
    height: 46,
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
    borderColor: 'secondary100',
    borderRadius: 'rounded-sm',
  },
  underlined: {
    borderBottomWidth: 1,
  },
};

export const inputSizeVariants = {
  defaults: {
    height: 46,
  },
  default: {
    height: 46,
  },
  lg: {
    height: 56,
  },
  sm: {
    height: 40,
  },
  hu: {
    height: undefined,
  },
};

export const inputValidationStatus = {
  defaults: {},
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
};
