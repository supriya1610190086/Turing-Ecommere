const express = require("express");
const bodyParser = require("body-parser");
const knex = require('knex')
const connection = require("../knexfile")
const knexcon = knex(connection["development"])
const crypto = require('crypto');
var app = express();
app.use(express.json());
app.use(bodyParser.json());

shpping_uniqueId = (req, res) => {
    const generateUuid = () => {
        return [4, 2, 2, 2, 6]
            .map(group => crypto.randomBytes(group).toString('hex'))
            .join('-');
    };
    cart_id = generateUuid();
    res.send({ cart_id: cart_id });
};

shoppingcart_add = (req, res) => {
    knexcon.select("*").from("shopping_cart").where("cart_id", req.body.cart_id)
        .then((data) => {
            if (data.length < 1) {
                var body = req.body;
                body["added_on"] = new Date()
                body["quantity"] = 1
                knexcon("shopping_cart").insert(body)
                    .then((data) => {
                        knexcon.select("*").from("shopping_cart").where("cart_id", req.body.cart_id)
                            .then((resp) => {
                                knexcon.select("*").from("shopping_cart").join("product", function() {
                                        this.on("product.product_id", req.body.product_id)
                                    }).where("cart_id", req.body.cart_id)
                                    .then((resp) => {
                                        resp[0]["subtotal"] = resp[0].quantity * resp[0].price
                                        res.send([{
                                            "item_id": resp[0].item_id,
                                            "product_id": resp[0].product_id,
                                            "attributes": resp[0].attributes,
                                            "quantity": resp[0].quantity,
                                            "name": resp[0].name,
                                            "price": resp[0].price,
                                            "image": resp[0].image,
                                            "subtotal": resp[0].subtotal
                                        }])
                                    })
                            })
                    })
                    .catch((err) => {
                        res.send(err)
                    })
            } else {
                var body = req.body;
                body["quantity"] = data[0].quantity + 1
                body["added_on"] = new Date()
                knexcon("shopping_cart").update(body).where("cart_id", body.cart_id)
                    .then((result) => {
                        knexcon.select("*").from("shopping_cart").join("product", function() {
                                this.on("product.product_id", req.body.product_id)
                            }).where("cart_id", req.body.cart_id)
                            .then((resp) => {
                                resp[0]["subtotal"] = resp[0].quantity * resp[0].price
                                res.send([{
                                    "item_id": resp[0].item_id,
                                    "product_id": resp[0].product_id,
                                    "attributes": resp[0].attributes,
                                    "quantity": resp[0].quantity,
                                    "name": resp[0].name,
                                    "price": resp[0].price,
                                    "image": resp[0].image,
                                    "subtotal": resp[0].subtotal
                                }])
                            })
                    })
                    .catch((err) => {
                        res.send(err)
                    })
            }
        })
        .catch((err) => {
            res.send(err)
        })
}

shoppingcart_cartId = (req, res) => {
    knexcon.select("*").from("shopping_cart").join("product", function() {
            this.on("product.product_id", "shopping_cart.product_id")
        }).where("cart_id", req.params.cart_id)
        .then((resp) => {
            if (resp.length > 0) {
                resp[0]["subtotal"] = resp[0].quantity * resp[0].price
                res.send([{
                    "item_id": resp[0].item_id,
                    "product_id": resp[0].product_id,
                    "attributes": resp[0].attributes,
                    "quantity": resp[0].quantity,
                    "name": resp[0].name,
                    "price": resp[0].price,
                    "image": resp[0].image,
                    "subtotal": resp[0].subtotal
                }])
            } else {
                res.send([{
                    "code": "USR_02",
                    "message": "The field example is empty.",
                    "field": "example",
                    "status": "500"
                }])
            }
        })
}
shoppingcart_itemId = (req, res) => {
    quantity = req.body.quantity
    knexcon.select("*").from("shopping_cart").where({ item_id: req.params.item_id })
        .update({ quantity: quantity })
        .then((result) => {
            elementList = []
            knexcon.select("*").from("shopping_cart")
                .then((result2) => {
                    for (i in result2) {
                        delete result2[i]["cart_id"]
                        delete result2[i]["buy_now"]
                        delete result2[i]["added_on"]
                        elementList.push(result2[i])
                        knexcon.select("*").from("product")
                            .then((data) => {
                                elementList[i]["product_id"] = data[0]["product_id"]
                                elementList[i]["name"] = data[0]["name"]
                                elementList[i]["price"] = data[0]["price"]
                                res.send(elementList)
                            })
                            .catch((err) => {
                                res.send(err)
                            })
                    }
                })
        })
        .catch((err) => {
            res.send(err)
        })
}

shoppingcart_empty = (req, res) => {
    knexcon.select("*").from("shopping_cart").where({ cart_id: req.params.cart_id }).
    del().
    then(() => {
            res.send([]);
        })
        .catch(() => {
            res.send([{
                "code": "USR_02",
                "message": "The field example is empty.",
                "field": "example",
                "status": "500"
            }])
        });
};

shoppingcart_move = (req, res) => {
    knexcon.select("*").from("shopping_cart").where({ item_id: req.params.item_id }).
    then((result) => {
            knexcon("move_cart").insert([{
                    item_id: result[0]["item_id"],
                    cart_id: result[0]["cart_id"],
                    product_id: result[0]["product_id"],
                    attributes: result[0]["attributes"],
                    quantity: result[0]["quantity"],
                    buy_now: result[0]["buy_now"]
                }])
                .then(() => {
                    knexcon.select("*").from("shopping_cart").where({ item_id: req.params.item_id }).
                    del().
                    then((data) => {
                        res.send("No data");
                    });
                })
                .catch((err) => {
                    res.send(err);
                });
        })
        .catch((err) => {
            res.send(err);
        });
};

shoppingcart_totalAmount = (req, res) => {
    knexcon.select("*").from("shopping_cart").
    join("product", "product.product_id", "=", "shopping_cart.product_id")
        .where({ cart_id: req.params.cart_id }).
    then((result) => {
            var amount = 0
            for (i in result) {
                amount += result[i]["price"] * result[i]["quantity"]
            }
            res.send({
                totalAmount: amount
            })
        })
        .catch((err) => {
            res.send(err);
        });
};


shoppingcart_saveForLater = (req, res) => {
    knexcon.select("item_id", "cart_id", "product_id", "attributes", "quantity").from("move_cart").
    where({ "move_cart.item_id": req.params.item_id }).
    then((result) => {
            knexcon("shopping_cart").insert([{
                    item_id: result[0]["item_id"],
                    cart_id: result[0]["cart_id"],
                    product_id: parseInt(result[0]["product_id"]),
                    attributes: result[0]["attributes"],
                    quantity: result[0]["quantity"],
                    buy_now: result[0]["buy_now"],
                    added_on: result[0]["added_on"] = new Date()
                }])
                .then(() => {
                    knexcon.select("*").from("move_cart").where({ item_id: req.params.item_id }).
                    del().
                    then(() => {
                        res.send("No data");
                    });
                })
                .catch((err) => {
                    res.send(err);
                });
        })
        .catch((err) => {
            res.send(err);
        });
};

Shopping_get_saved = (req, res) => {
    knexcon.select("item_id", "product.name", "attributes", "product.price").from("move_cart").
    join("product", "move_cart.cart_id", "=", "product.product_id").
    where({ cart_id: req.params.cart_id }).
    then((result) => {
            res.send(result);
        })
        .catch((err) => {
            res.send(err);
        });
};


shoppingcart_removeProduct = (req, res) => {
    knexcon.select("*").from("shopping_cart").where({ item_id: req.params.item_id })
        .del()
        .then((data) => {
            res.status(200);
        })
        .catch((err) => {
            res.send(err);
        });
};

module.exports = { shpping_uniqueId, shoppingcart_add, shoppingcart_cartId, shoppingcart_itemId, shoppingcart_empty, shoppingcart_move, shoppingcart_totalAmount, shoppingcart_saveForLater, Shopping_get_saved, shoppingcart_removeProduct }