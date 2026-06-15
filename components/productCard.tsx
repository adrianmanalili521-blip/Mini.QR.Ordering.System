import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native'

interface ProductCardProps {
    category: string
    imageSource: ImageSourcePropType
    name: string
    description: string
}

import CustomButton from './customButton'

export default function ProductCard({ category, imageSource, name, description }: ProductCardProps) {
    return (
        <View style={styles.container}>
            <Image source={imageSource} style={styles.image} resizeMode="cover" />
            <Text style={styles.category}>{category}</Text>
            <View style={{padding: 10}}>
                <Text>{name}</Text>
                <Text style={{fontSize: 12, color: 'grey'}}>{description}</Text>
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 5}}><Text style={{color: '#de7a28'}}>P285</Text>
                <CustomButton/></View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 155,
        borderWidth: 1,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#fff',
        borderColor: '#ddd',
        marginBottom: 16,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 120,
    },
    category: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        fontSize: 12,
        fontWeight: '700',
        zIndex: 2,
    },
})