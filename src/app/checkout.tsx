import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native'
import { X } from 'lucide-react-native'
import QRCode from 'react-native-qrcode-svg'
import { useCart } from '../../context/CartContext'
import { createOrder } from '../lib/api'

interface CheckoutScreenProps {
  visible: boolean
  onClose: () => void
}

export default function CheckoutScreen({ visible, onClose }: CheckoutScreenProps) {
  const { cart, getTotalPrice, removeFromCart, updateQuantity, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'cash' | null>(null)
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalPrice = getTotalPrice()
  const qrValue = `EMBERV2|TOTAL:${totalPrice}|TS:${Date.now()}`

  const canConfirm = paymentMethod !== null && cart.length > 0

  const handleConfirmOrder = async () => {
    if (!paymentMethod || !canConfirm) {
      return
    }

    setIsSubmitting(true)
    setOrderError(null)

    try {
      await createOrder(cart, paymentMethod, totalPrice)
      setOrderConfirmed(true)
      setTimeout(() => {
        clearCart()
        setOrderConfirmed(false)
        setPaymentMethod(null)
        onClose()
      }, 2000)
    } catch (error) {
      setOrderError(error instanceof Error ? error.message : 'Unable to submit order')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleQuantityChange = (name: string, quantity: number) => {
    updateQuantity(name, quantity)
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Cart</Text>
          <TouchableOpacity onPress={onClose}>
            <X color="black" size={24} />
          </TouchableOpacity>
        </View>

        {cart.length === 0 ? (
          <View style={styles.emptyCart}>
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
          </View>
        ) : (
          <ScrollView style={styles.mainScroll}>
            <ScrollView style={styles.cartItems}>
              {cart.map((item) => (
                <View key={item.id} style={styles.cartItem}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>P{item.price}</Text>
                  </View>
                  <View style={styles.quantityControl}>
                    <TouchableOpacity
                      onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
                      style={styles.quantityButton}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
                      style={styles.quantityButton}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                    <X color="#de7a28" size={20} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalPrice}>P{totalPrice}</Text>
            </View>

            <View style={styles.paymentSection}>
              <Text style={styles.paymentTitle}>Select Payment Method</Text>

              <TouchableOpacity
                style={[styles.paymentOption, paymentMethod === 'qr' && styles.paymentOptionSelected]}
                onPress={() => {
                  setPaymentMethod('qr')

                }}
              >
                <View style={styles.paymentOptionContent}>
                  <Text style={styles.paymentOptionText}>💳 QR Code Payment</Text>
                  <Text style={styles.paymentOptionSubtext}>Scan to pay</Text>
                </View>
                {paymentMethod === 'qr' && <View style={styles.selectedIndicator} />}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.paymentOption, paymentMethod === 'cash' && styles.paymentOptionSelected]}
                onPress={() => {
                  setPaymentMethod('cash')
                }}
              >
                <View style={styles.paymentOptionContent}>
                  <Text style={styles.paymentOptionText}>💵 Cash Payment</Text>
                  <Text style={styles.paymentOptionSubtext}>Pay in cash</Text>
                </View>
                {paymentMethod === 'cash' && <View style={styles.selectedIndicator} />}
              </TouchableOpacity>

              {paymentMethod === 'qr' && (
                <View style={styles.qrContainer}>
                  <Text style={styles.qrLabel}>Scan this QR code with your payment app</Text>
                  <View style={styles.qrBox}>
                    <QRCode value={qrValue} size={190} backgroundColor="white" />
                  </View>
                  <Text style={styles.qrHint}>Total: P{totalPrice}</Text>
                  <Text style={styles.qrInstruction}>
                    Scan the QR code with your payment app, then press Confirm Order.
                  </Text>
                </View>
              )}
            </View>

            {orderError ? <Text style={styles.paymentFailText}>{orderError}</Text> : null}
            {orderConfirmed ? <Text style={styles.paymentSuccessText}>Order placed successfully!</Text> : null}

            <TouchableOpacity
              style={[styles.confirmButton, (!canConfirm || isSubmitting) && styles.confirmButtonDisabled]}
              onPress={handleConfirmOrder}
              disabled={!canConfirm || isSubmitting}
            >
              <Text style={styles.confirmButtonText}>{isSubmitting ? 'Processing...' : 'Confirm Order'}</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>

    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 16,
    color: '#999',
  },
  mainScroll: {
    flex: 1,
  },
  cartItems: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: '600',
    fontSize: 14,
    color: '#000',
  },
  itemPrice: {
    color: '#de7a28',
    fontWeight: '600',
    marginTop: 4,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontWeight: '600',
    color: '#000',
  },
  quantity: {
    marginHorizontal: 8,
    fontWeight: '600',
    minWidth: 20,
    textAlign: 'center',
  },
  totalSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#de7a28',
  },
  paymentSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  paymentOptionSelected: {
    borderColor: '#de7a28',
    backgroundColor: '#fff5f0',
  },
  paymentOptionContent: {
    flex: 1,
  },
  paymentOptionText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#000',
  },
  paymentOptionSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#de7a28',
  },
  qrContainer: {
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    backgroundColor: '#fafafa',
    marginBottom: 16,
  },
  qrLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
    textAlign: 'center',
  },
  qrBox: {
    alignSelf: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  qrHint: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
  qrInstruction: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 12,
    color: '#444',
  },
  scanButton: {
    marginTop: 14,
    backgroundColor: '#de7a28',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  scannerModal: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 60,
    justifyContent: 'space-between',
  },
  scannerHeader: {
    padding: 16,
    backgroundColor: '#111',
    alignItems: 'center',
  },
  scannerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  scannerMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  scannerText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  paymentSuccessText: {
    marginTop: 12,
    marginHorizontal: 16,
    textAlign: 'center',
    color: '#2e7d32',
    fontWeight: '600',
  },
  paymentFailText: {
    marginTop: 12,
    marginHorizontal: 16,
    textAlign: 'center',
    color: '#d32f2f',
    fontWeight: '600',
  },
  confirmButton: {
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 14,
    backgroundColor: '#de7a28',
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmationBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 48,
    alignItems: 'center',
    minWidth: 280,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#de7a28',
    marginBottom: 12,
  },
  confirmationText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  confirmationTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  confirmationMethod: {
    fontSize: 14,
    color: '#999',
  },
})
