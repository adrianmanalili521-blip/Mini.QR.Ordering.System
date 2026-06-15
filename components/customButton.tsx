import { View, Text, StyleSheet, TouchableOpacity} from 'react-native'

export default function CustomButton() {
    return (
        <TouchableOpacity style={styles.container}>
            <Text style={{color: 'white', textAlign: 'center'}}>Add</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 20,
        width: 50,
        borderWidth: 1,
        borderRadius: 5, 
        backgroundColor: '#de7a28',
        borderColor: '#de7a28'
    }
})