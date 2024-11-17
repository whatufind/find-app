export const loader = require('../animations/loader.lottie');

export const animations = {
loader,
};

export type animationType = keyof typeof animations;

export const getAnimation = (animationKey: animationType): string => {
  return animations[animationKey];
};
