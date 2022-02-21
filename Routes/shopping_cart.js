const router = require('express').Router()
shopping_cart = require('../Controller/shopping_cart')








router.get('/shppingcart/genrateUniqueId', shopping_cart.shpping_uniqueId);
router.post('/shoppingcart/add', shopping_cart.shoppingcart_add);
router.get('/shppingcart/:cart_id', shopping_cart.shoppingcart_cartId);
router.put('/shppingcart/update/:item_id', shopping_cart.shoppingcart_itemId);
router.delete('/shppingcart/empty/:cart_id', shopping_cart.shoppingcart_empty);
router.get('/shoppingcart/moveToCart/:item_id', shopping_cart.shoppingcart_move);
router.get('/shoppingcart/totalAmount/:cart_id', shopping_cart.shoppingcart_totalAmount);
router.get('/shoppingcart/saveForLater/:item_id', shopping_cart.shoppingcart_saveForLater);
router.get('/shoppingcart/getSaved/:cart_id', shopping_cart.Shopping_get_saved);
router.delete('/shoppingcart/removeProduct/:item_id', shopping_cart.shoppingcart_removeProduct);




module.exports = router