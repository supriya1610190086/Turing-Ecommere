const router = require('express').Router()
const auth = require("../authories/auth_token");
order = require('../Controller/orders')

router.post('/orders', auth, order.orders)
router.get('/orders/:order_id', auth, order.orders_By_Id)
router.get('/orders/inCustomer/:order_id', auth, order.inCustomer);

router.get('/orders/shortDetail/:order_id', auth, order.orders_shortDetail_id);

module.exports = router