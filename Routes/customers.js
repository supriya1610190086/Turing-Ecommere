const router = require('express').Router()
const auth = require("../authories/auth_token");
customers = require('../Controller/customers')

router.post('/customers', customers.customers_signup);
router.post('/customers/login', customers.customer_login);
router.get('/customers', auth, customers.customers_get);
router.put('/customers', auth, customers.customers_put);
router.put('/customer/address', auth, customers.customer_address);
router.put('/customer/creditCard', auth, customers.customer_creditCard);

module.exports = router