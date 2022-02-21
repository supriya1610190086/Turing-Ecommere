const router = require('express').Router()

tax = require('../Controller/tax')
router.get('/tax', tax.tax)
router.get('/tax/:tax_id', tax.tax_by_tax_id)

module.exports = router