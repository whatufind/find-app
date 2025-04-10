export const cardVariants = {
  defaults: {
    shadowColor: 'secondary',
    backgroundColor: 'white',
    borderRadius: 'rounded-sm',
    overflow: 'hidden',
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  outlined: {
    borderRadius: 'rounded-sm',
    borderWidth: 1,
    borderColor: 'secondary100',
    elevation: 0,
  },
  elevated: {
    borderRadius: 'rounded-sm',
    backgroundColor: 'white',
    shadowColor: 'secondary700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
};

export type CardType = Exclude<keyof typeof cardVariants, 'defaults'>;
