import { Stack } from 'expo-router';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';

//Icons
import { ShoppingCart, User } from 'lucide-react-native'

//Context
import { CartProvider, useCart } from '../../context/CartContext';
import { fetchOrders, OrderRecord } from '../lib/api'

//Screens
import CheckoutScreen from './checkout';

function RootLayoutContent() {
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [adminVisible, setAdminVisible] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderRecord[] | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const { cart } = useCart();
  const cartCount = cart.length;

  const handleAdminSubmit = async () => {
    if (adminPassword === 'admin123') {
      setOrdersLoading(true)
      setAdminError(null)
      try {
        const fetchedOrders = await fetchOrders()
        setOrders(fetchedOrders)
      } catch (error) {
        setAdminError('Unable to load orders from backend')
      } finally {
        setOrdersLoading(false)
      }
    } else {
      setAdminError('Incorrect password')
    }
  }

  return (
    <>
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
                      <View style={styles.headerActions}>
                        <TouchableOpacity
                          onPress={() => setAdminVisible(true)}
                          style={styles.iconButton}
                        >
                          <User color='black' size={22} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          onPress={() => setCheckoutVisible(true)}
                          style={[styles.iconButton, styles.iconSpacer, { position: 'relative' }]}
                        >
                          <ShoppingCart color='black' size={22} />
                          {cartCount > 0 && (
                            <View style={styles.badge}>
                              <Text style={styles.badgeText}>{cartCount}</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      </View>
                  );
              }

          }}
        />
      </Stack>
      <CheckoutScreen visible={checkoutVisible} onClose={() => setCheckoutVisible(false)} />

      <Modal visible={adminVisible} animationType="fade" transparent>
        <View style={styles.adminModalOverlay}>
          <View style={styles.adminModal}>
            <Text style={styles.adminTitle}>Admin Access</Text>
            {orders ? (
              <ScrollView contentContainerStyle={styles.adminOrderList}>
                {orders.length === 0 ? (
                  <Text style={styles.adminOrderEmpty}>No orders yet.</Text>
                ) : (
                  orders.map((order) => (
                    <View key={order.id} style={styles.orderCard}>
                      <Text style={styles.orderHeading}>Order #{order.id}</Text>
                      <Text style={styles.orderMeta}>Total: P{order.total.toFixed(2)}</Text>
                      <Text style={styles.orderMeta}>Payment: {order.payment_method}</Text>
                      <Text style={styles.orderMeta}>Status: {order.status}</Text>
                      <Text style={styles.orderMeta}>Created: {new Date(order.created_at).toLocaleString()}</Text>
                      {order.items.map((item) => (
                        <Text style={styles.orderItem} key={item.id + item.name}>
                          {item.quantity} x {item.name}
                        </Text>
                      ))}
                    </View>
                  ))
                )}
              </ScrollView>
            ) : (
              <>
                <TextInput
                  value={adminPassword}
                  onChangeText={setAdminPassword}
                  placeholder="Enter password"
                  secureTextEntry
                  style={styles.adminInput}
                />
                {adminError ? <Text style={styles.adminError}>{adminError}</Text> : null}
                <View style={styles.adminButtons}>
                  <TouchableOpacity style={styles.adminButton} onPress={handleAdminSubmit}>
                    <Text style={styles.adminButtonText}>Submit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.adminButton, styles.adminCancel, styles.adminButtonSpacing]} onPress={() => setAdminVisible(false)}>
                    <Text style={[styles.adminButtonText, styles.adminCancelText]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

export default function RootLayout() {
  return (
    <CartProvider>
      <RootLayoutContent />
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
  },
  iconSpacer: {
    marginLeft: 12,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#de7a28',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#de7a28',
  },
  adminModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminModal: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  adminTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  adminInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  adminError: {
    color: '#d32f2f',
    marginBottom: 12,
    fontSize: 14,
  },
  adminButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  adminButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#de7a28',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminButtonSpacing: {
    marginLeft: 12,
  },
  adminCancel: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#de7a28',
  },
  adminButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  adminCancelText: {
    color: '#de7a28',
  },
  adminOrderList: {
    paddingBottom: 16,
  },
  adminOrderEmpty: {
    textAlign: 'center',
    color: '#666',
    marginTop: 12,
    fontSize: 14,
  },
  orderCard: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  orderHeading: {
    fontWeight: '700',
    marginBottom: 6,
    color: '#333',
  },
  orderMeta: {
    color: '#555',
    fontSize: 12,
    marginTop: 2,
  },
  orderItem: {
    color: '#000',
    fontSize: 13,
    marginTop: 4,
  },
});