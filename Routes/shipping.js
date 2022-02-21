const router = require('express').Router()

shipping = require('../Controller/shipping')
router.get('/shipping/region', shipping.shipping)
router.get('/shipping/region/:shipping_id', shipping.shipping_by_shipping_region_id)

module.exports = router