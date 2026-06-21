import express from 'express'
import cors from 'cors'
import { initDatabase, getProducts, saveOrder, getOrders } from './db.js'

const app = express()
app.use(cors())
app.use(express.json())

const db = await initDatabase()

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/products', async (req, res) => {
  try {
    const products = await getProducts(db)
    res.json({ products })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to load products' })
  }
})

app.post('/api/orders', async (req, res) => {
  try {
    const { items, paymentMethod, total } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' })
    }

    if (!paymentMethod || typeof total !== 'number') {
      return res.status(400).json({ message: 'Invalid order payload' })
    }

    const result = await saveOrder(db, { items, paymentMethod, total })
    res.status(201).json({ orderId: result.lastID })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to save order' })
  }
})

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await getOrders(db)
    res.json({ orders })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to load orders' })
  }
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`)
})
