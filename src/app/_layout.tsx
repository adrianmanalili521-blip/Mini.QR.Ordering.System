import { Stack } from 'expo-router';
import { View, Text } from 'react-native';

//Icons
import { ShoppingCart } from 'lucide-react-native'

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
            title: 'Ember & Co.',
            headerTitle: () => {
                return (
                    <View>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                        Ember & Co.
                    </Text>
                    <Text style={{ fontSize: 12 }}>
                        Scan. Order. Enjoy.
                    </Text>
                    </View>
                );
            },
            headerStyle: {
                backgroundColor: '#de7a28',
            },
            headerRight: () => {
                return (
                    <ShoppingCart color='black' size={22} />
                );
            }

        }}
      />
    </Stack>
  );
}