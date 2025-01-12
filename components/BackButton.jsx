
import React from 'react'
import { Pressable, StyleSheet, View, Text } from 'react-native';
import Icon from '../assets/icons';
import { theme } from '../constants/theme';

const BackButton = ({ size = 26, router }) => {
    return (
        <Pressable onPress={() => router.back()} style={styles.button}>
            <Icon name="arrowLeft" strokeWidth={2.5} size={size} color={theme.colors.text} />
        </Pressable>
    );
};

export default BackButton
const styles = StyleSheet.create({
    button: {
        alignSelf: 'flex-start',
        padding: 5,
        marginTop: 2,
        borderRadius: theme.radius.sm,
        backgroundColor: '#e1fffc'
    }
})