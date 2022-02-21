const router = require('express').Router()

attributes = require('../Controller/attributes')
router.get('/attributes', attributes.attributes)
router.get('/attributes/:attribute_id', attributes.attibutes_by_attribute_id)
router.get('/attributes/value/:attribute_id', attributes.attributes_by_value)
router.get('/attributes/inProject/:product_id', attributes.attributes_by_product_id)

module.exports = router