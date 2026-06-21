import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, ScrollView } from 'react-native'

// props
import FilterButton from '../../components/filterButton'
import ProductCard from '../../components/productCard'
import { API_BASE_URL, ProductApiModel } from '../lib/api'
import { productImages } from '../lib/images'

export default function Index() {
  const [selected, setSelected] = useState<string | null>(null)
  const [products, setProducts] = useState<ProductApiModel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const filters = ['All', 'Burgers', 'Sides', 'Drinks', 'Desserts']

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`)
        if (!res.ok) throw new Error('network')
        const body = await res.json()
        if (mounted) setProducts(body.products ?? [])
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error'
        console.error('Failed to load products:', errorMsg)
        if (mounted) setError(`Unable to load products (${errorMsg}). Backend: ${API_BASE_URL}`)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const visibleProducts = products.filter(
    (product) => !selected || selected === 'All' || product.title === selected
  )

  return (
    <View style={styles.main}>
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.container1}
        >
          {filters.map((item) => (
            <FilterButton
              key={item}
              title={item}
              selected={selected === item}
              onPress={() => setSelected((prev) => (prev === item ? null : item))}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.separator} />

      {loading ? (
        <Text style={styles.statusText}>Loading menu...</Text>
      ) : error ? (
        <Text style={[styles.statusText, styles.errorText]}>{error}</Text>
      ) : visibleProducts.length === 0 ? (
        <Text style={styles.statusText}>No products available.</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.productList}>
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              category={product.title}
              imageSource={productImages[product.imageKey] ?? productImages['smash-burger']}
              name={product.name}
              description={product.description}
              price={product.price}
            />
          ))}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  main:{
    flex: 1,
    margin: 10,
    padding: 5,
  },
  filterContainer: {
    height: 60,
    justifyContent: 'center',
  },
  container1: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    gap: 8
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 15,
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  statusText: {
    color: '#444',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    color: '#d32f2f',
  },
})

