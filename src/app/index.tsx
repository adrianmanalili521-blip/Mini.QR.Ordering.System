import React, { useState } from 'react'
import { Text, View, StyleSheet, ScrollView } from 'react-native'

//props
import FilterButton from '../../components/filterButton'
import ProductCard from '../../components/productCard'

export default function Index() {
  const [selected, setSelected] = useState<string | null>(null)

  const filters = ['All', 'Burgers', 'Sides', 'Drinks', 'Desserts', 'Salads']
  const products = [
    {
      title: 'Burgers',
      imageSource: require('../../assets/images/smash-burger.jpeg'),
      name: 'Signature Smash Burger',
      description: 'Double smashed patty, cheddar, caramelized, onion, house sauce'
    },
    {
      title: 'Burgers',
      imageSource: require('../../assets/images/crispy-chicken-burger.jpg'),
      name: 'Crispy Chicken Sandwich',
      description: 'Buttermilk fried chicken, pickles, spicy mayo, brioche bun'
    },
    {
      title: 'Burgers',
      imageSource: require('../../assets/images/truffle-mushroom-burger.jpeg'),
      name: 'Truffle Mushroom Burger',
      description: 'Wagyu patty, wild mushrooms, truffle aioli, arugula'
    },
    {
      title: 'Sides',
      imageSource: require('../../assets/images/garlic-parmesan-fries.jpg'),
      name: 'Garlic Parmesan Fries',
      description: 'Hand-cut fires tossed in garlic butter, parmesan, herbs'
    },
    {
      title: 'Sides',
      imageSource: require('../../assets/images/onion-rings.jpg'),
      name: 'Onion Rings',
      description: 'Beer-battered thick-cut onion rings with smoky ranch'
    },
    {
      title: 'Sides',
      imageSource: require('../../assets/images/loaded-nachos.jpeg'),
      name: 'Loaded Nachos',
      description: 'Tortilla chips, queso, jalapenos, pico de gallo, sour cream'
    },
    {
      title: 'Drinks',
      imageSource: require('../../assets/images/craft-lemonade.jpeg'),
      name: 'Craft Lemonade',
      description: 'Freshly squeezed, house-made simple syrup, mint'
    },
    {
      title: 'Drinks',
      imageSource: require('../../assets/images/iced-brown-sugar-latte.jpg'),
      name: 'Iced Brown Sugar Latte',
      description: 'Espresso, brown sugar syrup, oat milk, over ice'
    },
    {
      title: 'Drinks',
      imageSource: require('../../assets/images/mango-cocumber-agua-fresca.jpg'),
      name: 'Mango Cucumber Agua Fresca',
      description: 'Fresh mango, cucumber, lime, chili salt rim'
    },
    {
      title: 'Desserts',
      imageSource: require('../../assets/images/chocolate-lava-cake.jpeg'),
      name: 'Chocolate Lava Cake',
      description: 'Warm dark chocolate cake, molten center, vanilla ice cream'
    },
    {
      title: 'Desserts',
      imageSource: require('../../assets/images/churros-with-dipping-sauce.jpg'),
      name: 'Churos with Dipping Sauce',
      description: 'Cinnamon sugar churros, chocolate ganache, caramel sauce'
    },
    
  ]

  return (
    <View style={styles.main}>
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

      <View style={styles.separator} />

      <ScrollView contentContainerStyle={styles.productList}>
        {products.map((product, index) => (
          <ProductCard
            key={index}
            category={product.title}
            imageSource={product.imageSource}
            name={product.name}
            description={product.description}

          />
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  main:{
    flex: 1,
    margin: 10,
    padding: 5,
  },
  container1: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
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
  },
})

