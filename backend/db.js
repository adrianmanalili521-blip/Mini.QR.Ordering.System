import sqlite3 from 'sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataPath = path.resolve(__dirname, 'data')
const dbFile = path.join(dataPath, 'store.db')

sqlite3.verbose()

function openDb() {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(dataPath)) {
      fs.mkdirSync(dataPath, { recursive: true })
    }

    const db = new sqlite3.Database(dbFile, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve(db)
      }
    })
  })
}

function run(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve({ lastID: this.lastID, changes: this.changes })
      }
    })
  })
}

function all(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

export async function initDatabase() {
  const db = await openDb()

  await run(
    db,
    `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      imageKey TEXT NOT NULL
    )`
  )

  await run(
    db,
    `CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL,
      items TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      total REAL NOT NULL,
      status TEXT NOT NULL
    )`
  )

  const existing = await all(db, 'SELECT COUNT(1) as count FROM products')
  if (existing[0]?.count === 0) {
    const products = [
      {
        title: 'Burgers',
        name: 'Signature Smash Burger',
        description: 'Double smashed patty, cheddar, caramelized onion, house sauce',
        price: 285,
        imageKey: 'smash-burger'
      },
      {
        title: 'Burgers',
        name: 'Crispy Chicken Sandwich',
        description: 'Buttermilk fried chicken, pickles, spicy mayo, brioche bun',
        price: 295,
        imageKey: 'crispy-chicken-burger'
      },
      {
        title: 'Burgers',
        name: 'Truffle Mushroom Burger',
        description: 'Wagyu patty, wild mushrooms, truffle aioli, arugula',
        price: 395,
        imageKey: 'truffle-mushroom-burger'
      },
      {
        title: 'Sides',
        name: 'Garlic Parmesan Fries',
        description: 'Hand-cut fries tossed in garlic butter, parmesan, herbs',
        price: 125,
        imageKey: 'garlic-parmesan-fries'
      },
      {
        title: 'Sides',
        name: 'Onion Rings',
        description: 'Beer-battered thick-cut onion rings with smoky ranch',
        price: 145,
        imageKey: 'onion-rings'
      },
      {
        title: 'Sides',
        name: 'Loaded Nachos',
        description: 'Tortilla chips, queso, jalapenos, pico de gallo, sour cream',
        price: 185,
        imageKey: 'loaded-nachos'
      },
      {
        title: 'Drinks',
        name: 'Craft Lemonade',
        description: 'Freshly squeezed, house-made simple syrup, mint',
        price: 95,
        imageKey: 'craft-lemonade'
      },
      {
        title: 'Drinks',
        name: 'Iced Brown Sugar Latte',
        description: 'Espresso, brown sugar syrup, oat milk, over ice',
        price: 115,
        imageKey: 'iced-brown-sugar-latte'
      },
      {
        title: 'Drinks',
        name: 'Mango Cucumber Agua Fresca',
        description: 'Fresh mango, cucumber, lime, chili salt rim',
        price: 105,
        imageKey: 'mango-cucumber-agua-fresca'
      },
      {
        title: 'Desserts',
        name: 'Chocolate Lava Cake',
        description: 'Warm dark chocolate cake, molten center, vanilla ice cream',
        price: 165,
        imageKey: 'chocolate-lava-cake'
      },
      {
        title: 'Desserts',
        name: 'Churros with Dipping Sauce',
        description: 'Cinnamon sugar churros, chocolate ganache, caramel sauce',
        price: 145,
        imageKey: 'churros-with-dipping-sauce'
      }
    ]

    for (const product of products) {
      await run(
        db,
        'INSERT INTO products (title, name, description, price, imageKey) VALUES (?, ?, ?, ?, ?)',
        [product.title, product.name, product.description, product.price, product.imageKey]
      )
    }
  }

  return db
}

export async function getProducts(db) {
  return all(db, 'SELECT * FROM products ORDER BY title, name')
}

export async function saveOrder(db, order) {
  const itemsJson = JSON.stringify(order.items)
  return run(
    db,
    'INSERT INTO orders (created_at, items, payment_method, total, status) VALUES (?, ?, ?, ?, ?)',
    [new Date().toISOString(), itemsJson, order.paymentMethod, order.total, 'CONFIRMED']
  )
}

export async function getOrders(db) {
  return all(db, 'SELECT * FROM orders ORDER BY created_at DESC')
}
