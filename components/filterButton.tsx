import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

interface FilterButtonProps {
    title: string
    selected?: boolean
    onPress?: () => void
}

export default function FilterButton({ title, selected = false, onPress }: FilterButtonProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={[styles.container, selected ? styles.containerSelected : styles.containerDefault]}
        >
            <Text style={selected ? styles.textSelected : styles.textDefault}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        height: 40,
        paddingHorizontal: 12,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerDefault: {
        backgroundColor: '#ffffff',
        borderColor: '#d0d0d0',
    },
    containerSelected: {
        backgroundColor: '#de7a28',
        borderColor: '#de7a28',
    },
    textDefault: {
        color: '#000000',
        fontSize: 14,
        fontWeight: '500',
    },
    textSelected: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 14,
    },
})