const express = require("express");
const app = express();
const PORT = 8000

const department = require('./Routes/department')
const categories = require('./Routes/categories')
const attributes = require('./Routes/attributes')
const products = require('./Routes/products')
const tax = require('./Routes/tax')
const shipping = require('./Routes/shipping')
const customers = require('./Routes/customers')
const order = require('./Routes/orders')
const shipping_cart = require('./Routes/shopping_cart')

app.use(express.json())

app.use('/', department, categories, attributes, products, tax, shipping, customers, order, shipping_cart)

app.listen(PORT, () => {
    console.log(`Server Running on port:http://localhost:${PORT}`)
})