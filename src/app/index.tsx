import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, ScrollView } from 'react-native'

//props
import FilterButton from '../../components/filterButton'
import { useNavigation } from 'expo-router'

const SELECTED_COLOR = '#de7a28'
const DEFAULT_HEADER_COLOR = '#d64700'

export default function Index() {
  const navigation: any = useNavigation()
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    const bg = selected ? SELECTED_COLOR : DEFAULT_HEADER_COLOR
    navigation.setOptions?.({ headerStyle: { backgroundColor: bg } })
  }, [selected, navigation])

  const filters = ['All', 'Burgers', 'Sides', 'Drinks', 'Desserts', 'Salads']

  return (
    <View style={styles.main}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container1}
      >
        {filters.map((f) => (
          <FilterButton
            key={f}
            title={f}
            selected={selected === f}
            onPress={() => setSelected(f)}
          />
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  main:{
    margin: 10, 
    padding: 5
  },
  container1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
})

