const express = require("express");
const bodyParser = require("body-parser");
const knex = require('knex')
const connection = require("../knexfile")
const knexcon = knex(connection["development"])
const jwt = require("jsonwebtoken");
var app = express();
app.use(express.json());
app.use(bodyParser.json());

customers_signup = (req, res) => {
    knexcon.select("*").from("customer").where("email", req.body.email)
        .then((data) => {
            if (data.length < 1) {
                knexcon("customer").insert(req.body)
                    .then(() => {
                        knexcon.select("customer.customer_id", "customer.name", "customer.email", "customer.credit_card", "customer.address_1", "customer.address_2", "customer.city", "customer.region", "customer.postal_code", "customer.country", "customer.shipping_region_id", "customer.day_phone", "customer.eve_phone", "customer.mob_phone").from("customer ").where("email ", req.body.email)
                            .then((customer) => {
                                var token = jwt.sign({ "customer_id": customer[0].customer_id, "name": customer[0].name, "role": "customer", }, "customer", { expiresIn: '24h' })
                                res.send({
                                    "customer": customer,
                                    "accessToken": token,
                                    "expires_in": "24h"

                                })
                            })
                    })
                    .catch((err) => {
                        res.send(err)
                    })
            } else {
                res.send({ "Error": "Duplicate entry" })
            }

        })
}

customer_login = (req, res) => {
    knexcon.select("customer.customer_id", "customer.name", "customer.email", "customer.credit_card", "customer.address_1", "customer.address_2", "customer.city", "customer.region", "customer.postal_code", "customer.country", "customer.shipping_region_id", "customer.day_phone", "customer.eve_phone", "customer.mob_phone").
    from('customer').where({ email: req.body.email, password: req.body.password })
        .then(customer => {
            if (customer.length !== 0) {
                var log_token = jwt.sign({ "customer_id": customer[0].customer_id, "name": customer[0].name, "role": "customer" }, "customer", {
                    expiresIn: "2h"
                });
                res.send({
                    customer,
                    access_token: log_token
                });
            } else {
                res.status(400).json({
                    message: "failed"
                });
            };
        })
        .catch((err) => {
            res.send(err);
        });
};



customers_get = (req, res) => {
    get_token = req.data
    knexcon.select("customer.customer_id", "customer.name", "customer.email", "customer.credit_card", "customer.address_1", "customer.address_2", "customer.city", "customer.region", "customer.postal_code", "customer.country", "customer.shipping_region_id", "customer.day_phone", "customer.eve_phone", "customer.mob_phone").from("customer").where({ customer_id: get_token.customer_id })
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            res.send(err);
        });
};

customers_put = (req, res) => {
    token = req.data
    knexcon("customer").where({ customer_id: token.customer_id }).update({
            "name": req.body.name,
            "email": req.body.email,
            "password": req.body.password,
            "day_phone": req.body.day_phone,
            "eve_phone": req.body.eve_phone,
            "mob_phone": req.body.mob_phone
        })
        .then((result) => {

            knexcon.select("customer.customer_id", "customer.name", "customer.email", "customer.credit_card", "customer.address_1", "customer.address_2", "customer.city", "customer.region", "customer.postal_code", "customer.country", "customer.shipping_region_id", "customer.day_phone", "customer.eve_phone", "customer.mob_phone").from("customer").where({ customer_id: token.customer_id })
                .then((data) => {
                    res.send(data)
                })
        })
        .catch((err) => {
            res.send(err);
        });

};

customer_address = (req, res) => {
    add_token = req.data
    knexcon("customer").where({ customer_id: add_token.customer_id }).update({
            address_1: req.body.address_1,
            address_2: req.body.address_2,
            city: req.body.city,
            region: req.body.region,
            postal_code: req.body.postal_code,
            country: req.body.country,
            shipping_region_id: req.body.shipping_region_id
        })
        .then((result) => {

            knexcon.select("customer.customer_id", "customer.name", "customer.email", "customer.credit_card", "customer.address_1", "customer.address_2", "customer.city", "customer.region", "customer.postal_code", "customer.country", "customer.shipping_region_id", "customer.day_phone", "customer.eve_phone", "customer.mob_phone").from("customer").where({ customer_id: add_token.customer_id })
                .then((data) => {
                    res.send(data)
                })
        })
        .catch((err) => {
            res.send(err)
        });
}

customer_creditCard = (req, res) => {
    cred_token = req.data
    knexcon.select("*").from("customer").where({ customer_id: cred_token.customer_id }).update({
            credit_card: req.body.credit_card
        })
        .then((result) => {
            knexcon.select("customer.customer_id", "customer.name", "customer.email", "customer.credit_card", "customer.address_1", "customer.address_2", "customer.city", "customer.region", "customer.postal_code", "customer.country", "customer.shipping_region_id", "customer.day_phone", "customer.eve_phone", "customer.mob_phone").from("customer").where({ customer_id: cred_token.customer_id })
                .then((data) => {
                    res.send(data)
                })
        })
        .catch((err) => {
            res.send(err)
        })
}
module.exports = { customers_signup, customer_login, customers_get, customers_put, customer_address, customer_creditCard }