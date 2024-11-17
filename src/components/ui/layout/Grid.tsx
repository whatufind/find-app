import theme from '@/theme';
import React, { type FC, type PropsWithChildren, type ReactElement } from 'react';
import { ScrollView } from 'react-native';
import { Box } from './Box';
import HStack from './HStack';

type spacingProp = keyof typeof theme.spacing

type SpacerProps = {
    axis?: 'Vertical' | 'Horizontal';
    spacing: spacingProp
};

const Spacer: FC<SpacerProps> = ({ spacing, axis = 'Vertical' }) => (
    <Box width={axis === 'Horizontal' ? spacing : 0} height={axis === 'Vertical' ? spacing : 0} />
);

const intersperse = (item: ReactElement, array: ReactElement[]): ReactElement[] =>
    array.reduce<ReactElement[]>((acc, each, index) => {
        const isLast = index + 1 === array.length;
        if (isLast) {
            return [...acc, each];
        }
        return [...acc, each, React.cloneElement(item, { key: `spacer-${index}` })];
    }, []);

type GridProps = PropsWithChildren & {
    crossAxisCount: spacingProp;
    mainAxisSpacing?: spacingProp;
    crossAxisSpacing?: spacingProp;
};

export const Grid: FC<GridProps> = ({
    children,
    crossAxisCount,
    mainAxisSpacing = 0,
    crossAxisSpacing = 0,
}): ReactElement => {
    const defaultSection = Array.from({ length: crossAxisCount }).map(() => null);
    const numberOfColumns = Math.ceil(React.Children.count(children) / crossAxisCount);
    const copiedChildren = React.Children.toArray(children);

    const getItemsForRow = (rowIndex: number): ReactElement[] =>
        defaultSection.map((_, index) => {
            const childIndex = rowIndex * crossAxisCount + index;

            return copiedChildren[childIndex] ? (
                <Box flex={1} key={`child-${childIndex}`}>
                    {copiedChildren[childIndex]}
                </Box>
            ) : (
                <Box flex={1} key={`child-empty-${childIndex}`} />
            );
        });

    const list = Array.from({ length: numberOfColumns })?.map((_, idx) => (
        <HStack key={`row-${idx}`}>
            {intersperse(<Spacer axis="Horizontal" spacing={crossAxisSpacing} />, getItemsForRow(idx))}
        </HStack>
    ));

    return <ScrollView>{intersperse(<Spacer spacing={mainAxisSpacing} />, list)}</ScrollView>;
};

export default Grid;
