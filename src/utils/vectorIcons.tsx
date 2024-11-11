import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FA from 'react-native-vector-icons/FontAwesome';
import FA5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Zocial from 'react-native-vector-icons/Zocial';

export const vectorIcons = {
    ant: AntDesign,
    entypo: Entypo,
    evil: EvilIcons,
    fa: FA,
    fa5: FA5,
    feather: Feather,
    fontisto: Fontisto,
    foundation: Foundation,
    ionicon: Ionicons,
    material: MaterialIcons,
    materialCommunity: MaterialCommunityIcons,
    octicon: Octicons,
    simpleLine: SimpleLineIcons,
    zocial: Zocial,
};

export type IconKeys = keyof typeof vectorIcons;
export type IconValues = (typeof vectorIcons)[IconKeys];

export const getVectorIcon = (type: IconKeys): IconValues => {
    return vectorIcons[type];
};
