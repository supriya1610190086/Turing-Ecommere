const router = require('express').Router()
const auth = require("../authories/auth_token");
products = require('../Controller/products')
router.get('/products', products.products)
router.get('/products/search', products.product_search);
router.get('/products/:product_id', products.products_by_products_id)
router.get('/products/inCategory/:category_id', products.products_by_category_id)
router.get('/products/inDepartment/:department_id', products.products_by_department_id)
router.get('/products/:product_id/details', products.product_by_details)
router.get('/products/:product_id/location', products.products_by_location)
router.get('/products/:product_id/reviews', products.products_by_review)
router.post('/products/:product_id/reviews', auth, products.products_post_review)

module.exports = router