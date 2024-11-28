
export const badgeVariant = {
    defaults: {
     borderRadius:'rounded-full',
     alignSelf: 'flex-start',
     backgroundColor: 'primary',
     borderColor: 'primary',
     position:'absolute',
     zIndex:10,
     minWidth:18,

    },
    primary: {
      backgroundColor: 'primary',
      borderColor: 'primary',
    },
    secondary: {
      backgroundColor: 'secondary',
      borderColor: 'secondary',
    },
    success: {
      backgroundColor: 'success',
      borderColor: 'success',
    },
    warning: {
      backgroundColor: 'warning',
      borderColor: 'warning',
    },
    danger: {
      backgroundColor: 'danger',
      borderColor: 'danger',
    },
  };

  export type BadgeVariantType = Exclude<keyof typeof badgeVariant, 'defaults'>;

  export const badgeType = {
    defaults: {
      borderRadius: 'rounded-xs',
    },
    outlined: {
      backgroundColor: 'transparent',
      borderWidth: 1,
    },
    contained: {},
  };

  export const badgePosition = {
    defaults: {
      alignSelf: 'flex-start',
    },
    topLeft: {
      alignSelf: 'flex-start',
    },
    topRight: {
      alignSelf: 'flex-end',
    },
  };
