export const avatar = require('../images/avatar.png');


export const images = {
    avatar,
};

export type Image = keyof typeof images;

export const getImage = (imageKey: Image): string => {
    return images[imageKey];
};
