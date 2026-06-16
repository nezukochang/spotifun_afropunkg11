import React from 'react';
import { Text } from 'react-native';
import Animated, {
    FadeInUp,
    Layout,
} from 'react-native-reanimated';

export const StaggeredEntry = ({ index, children }: { index: number, children: React.ReactNode }) => {
    return (
        <Animated.View
            entering={FadeInUp.delay(index * 50).duration(400)}
            layout={Layout.springify()}
        >
            {children}
        </Animated.View>
    );
};

export const StandardTitle = ({ text, style }: { text: string, style?: any }) => {
    return (
        <Text style={style}>{text}</Text>
    );
};
