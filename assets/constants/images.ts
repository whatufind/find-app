export const avatar = require('../images/avatar.png');
export const banner = require('../images/banner.jpg');
export const logo = require('../images/logo.png');


export const images = {
    avatar,
    banner,
    logo,
};

export type Image = keyof typeof images;

export const getImage = (imageKey: Image): string => {
    return images[imageKey];
};
