const express = require("express");
const bodyParser = require("body-parser");
const knex = require('knex')
const connection = require("../knexfile")
const knexcon = knex(connection["development"])
var app = express();
app.use(express.json());
app.use(bodyParser.json());

orders = (req, res) => {
    token = req.data
    knexcon('shopping_cart')
        .join('product', 'product.product_id', 'shopping_cart.product_id')
        .select('*').where('shopping_cart.cart_id', req.body.cart_id)
        .then((data) => {
            if (data.length === 0) {
                return res.send({ message: 'invalid cart id' })
            }
            sum = 0
            for (i of data) {
                sum += i.price * i.quantity
            }
            const order = {
                total_amount: sum,
                created_on: new Date(),
                shipped_on: new Date(),
                status: 1,
                customer_id: token.customer_id,
                shipping_id: req.body.shipping_id,
                tax_id: req.body.tax_id,
            }
            knexcon('orders').insert(order)
                .then((data) => {
                    for (i of data) {
                        const order_details = {
                            order_id: data[0],
                            product_id: i.product_id,
                            attributes: i.attributes,
                            product_name: i.name,
                            quantity: i.quantity,
                            unit_cost: i.price
                        }
                        knexcon('order_detail').insert(order_details)
                            .then((orderDeatil) => {}).catch((err) => {
                                res.send({ error: err })
                            })
                    }
                    knexcon.select("*").from('shopping_cart').where('cart_id', req.body.cart_id).del()
                        .then(() => {
                            res.send({
                                "order_id": data[0]
                            })
                        }).catch((err) => {
                            res.send({ err: err })
                        })

                }).catch((err) => {
                    res.send({
                        error: err
                    })
                })
        }).catch((err) => {
            res.json({
                message: err
            })
        })
}


orders_By_Id = (req, res) => {
    token = req.data
    knexcon.select("*").from("customer").where({ customer_id: token.customer_id }).
    then((data) => {
            knexcon.select("*").from("order_detail").where({ order_id: req.params.order_id }).
            then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    res.send(err);
                });
        })
        .catch((err) => {
            res.send(err);
        });
};



inCustomer = (req, res) => {
    token = req.data
    knexcon('orders')
        .join('customer', 'orders.customer_id', 'customer.customer_id')
        .select('orders.order_id', 'orders.total_amount', 'orders.created_on', 'orders.shipped_on', 'orders.status', 'customer.name').where('customer.customer_id', '=', token.customer_id)
        .then((getByCustomer) => {
            res.send(
                getByCustomer
            )
        }).catch((err) => {
            res.json({
                message: 'data not found'
            })
        })

}


orders_shortDetail_id = (req, res) => {
    knexcon.select("*")
        .from("orders")
        .join("order_detail", function() {
            this.on("orders.order_id", "order_detail.order_id")
        })
        .where("orders.order_id", req.params.order_id)
        .then((resp) => {
            res.send({
                "order_id": resp[0].order_id,
                "total_amount": resp[0].total_amount,
                "created_on": resp[0].created_on,
                "shipped_on": resp[0].shipped_on,
                "status": resp[0].status,
                "name": resp[0].product_name
            })
        })
}



module.exports = { orders, orders_By_Id, inCustomer, orders_shortDetail_id }