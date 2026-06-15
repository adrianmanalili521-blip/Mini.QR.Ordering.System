import { View, Text, StyleSheet, Image, ImageSourcePropType, TouchableOpacity } from 'react-native'
import { useCart } from '../context/CartContext'

interface ProductCardProps {
    category: string
    imageSource: ImageSourcePropType
    name: string
    description: string
    price: number
}

export default function ProductCard({ category, imageSource, name, description, price }: ProductCardProps) {
    const { addToCart } = useCart()

    const handleAddToCart = () => {
        addToCart({
            name,
            price,
            category,
        })
    }

    return (
        <View style={styles.container}>
            <Image source={imageSource} style={styles.image} resizeMode="cover" />
            <Text style={styles.category}>{category}</Text>
            <View style={{padding: 10}}>
                <Text style={{fontWeight: '600'}}>{name}</Text>
                <Text style={{fontSize: 12, color: 'grey'}}>{description}</Text>
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, alignItems: 'center'}}>
                    <Text style={{color: '#de7a28', fontWeight: '600', fontSize: 14}}>P{price}</Text>
                    <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>
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
    addButton: {
        backgroundColor: '#de7a28',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 12,
    },
})