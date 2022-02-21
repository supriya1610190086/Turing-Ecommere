const router = require('express').Router()

categories = require('../Controller/categories')
router.get('/categories', categories.categories)
router.get('/categories/:category_id', categories.categories_by_category_id)
router.get('/categories/inProduct/:product_id', categories.categories_by_product_id)
router.get('/categories/inDepartment/:department_id', categories.categories_by_department_id)

module.exports = router