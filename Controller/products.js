const express = require("express");
const bodyParser = require("body-parser");
const knex = require('knex')
const connection = require("../knexfile");
const { query } = require("express");
const knexcon = knex(connection["development"])
var app = express();
app.use(express.json());
app.use(bodyParser.json());


products = (req, res) => {
    knexcon.select("*").from("product").
    then(() => {
            if (req.query.page == undefined) {
                req.query.page = 1
            }
            if (req.query.limit == undefined) {
                req.query.limit = 20
            }
            knexcon("product").count("product_id")
                .then((count) => {
                    knexcon.select("*").from("product").offset((req.query.page - 1) * req.query.limit).limit(req.query.limit)
                        .then((data) => {
                            for (i in data) {
                                if (req.query.description_length != undefined) {
                                    data[i]["description"] = data[i]["description"].slice(0, data[i]["description"].length - (data[i]["description"].length - req.query.description_length))
                                } else {
                                    data[i]["description"] = data[i]["description"]
                                }
                            }
                            res.send({
                                count: count[0]['count(`product_id`)'],
                                rows: data
                            })
                        })
                        .catch((err) => {
                            res.send(err)
                        })
                })
        })
        .catch((err) => {
            res.send(err)
        })
}

product_search = (req, res) => {
    var query = []
    var result2 = []
    knexcon.select("*").from("product").
    then((result) => {

            if (req.query.page == undefined) {
                req.query.page = 1
            }
            if (req.query.limit == undefined) {
                req.query.limit = 20
            }
            knexcon.select("*").from("product").offset((req.query.page - 1) * req.query.limit).limit(req.query.limit).
            then((data) => {
                    if (req.query.query_string != undefined) {
                        for (i in data) {
                            if (req.query.query_string.includes(data[i]["description"]) == true) {
                                query.push(data[i])
                            } else {
                                query.push(data[i])
                            }
                        }
                        for (j in query) {
                            if (req.query.description_length != undefined) {
                                query[j]["description"] = query[j]["description"].slice(0, query[j]["description"].length - (query[j]["description"].length - req.query.description_length)) + ".."
                                result2.push(query[j])
                            } else {
                                query[j]["description"] = query[j]["description"]
                                result2.push(query[j])
                            }

                        }
                        res.send(result2)
                    } else {
                        res.send("query is not there")
                    }
                })
                .catch((err) => {
                    res.send(err)
                })
        })
        .catch((err) => {
            res.send(err)
        })
}

products_by_products_id = function(req, res) {
    knexcon('product')
        .select('*')
        .where('product_id', req.params.product_id)
        .then((data) => {
            res.send(data)
        })
        .catch((err) => {
            res.send(err)
        })
}


products_by_category_id = (req, res) => {
    var des = req.description_length;
    knexcon.select("product.product_id", "product.name", "product.description", "product.price", "product.discounted_price", "product.thumbnail").from("product")
        .join("product_category", function() {
            this.on("product.product_id", "product_category.product_id")
        }).where("product_category.category_id", req.params.category_id).limit(req.query.limit).offset((req.query.page - 1) * req.query.limit)
        .then((data) => {
            res.send({ counts: 18, rows: data })
        })
}


products_by_department_id = (req, res) => {
    var body = req.query;
    var limit = body.limit;
    var des = req.description_length;
    knexcon.select("*").from("category").join("product_category", function() {
            this.on("category.category_id", "product_category.category_id")
        }).join('product', function() {
            this.on("product_category.product_id", "product.product_id")
        }).where("department_id", req.params.department_id).limit(limit).offset((req.query.page - 1) * req.query.limit)
        .then((data) => {
            var out = []
            for (var i of data) {
                var dic = {
                    "product_id": i.product_id,
                    "name": i.name,
                    "description": i.description,
                    "price": i.price,
                    "discounted_price": i.discounted_price,
                    "thumbnail": i.thumbnail
                }
                out.push(dic)
            }
            res.send({ counts: 16, rows: out })
        })
}
product_by_details = (req, res) => {
    knexcon.select("*").from("product").where({ product_id: req.params.product_id }).
    then((result) => {
            for (i in result) {
                delete result[i]["thumbnail"]
                delete result[i]["display"]
            }
            res.send(result)
        })
        .catch((err) => {
            res.send(err)
        })
}

products_by_location = (req, res) => {
    knexcon.select("*").from("product_category").where({ product_id: req.params.product_id }).
    then((result) => {
            knexcon.select("*").from("category").where({ category_id: result[0]["category_id"] }).
            then((data) => {
                    knexcon.select("*").from("department").where({ department_id: data[0]["department_id"] }).
                    then((data2) => {
                            data[0]["department_name"] = data2[0]["name"]
                            data[0]["department_id"] = data2[0]["department_id"]
                            delete data[0]["description"]
                            res.send(data)
                        })
                        .catch((err) => {
                            res.send(err)
                        })
                })
                .catch((err) => {
                    res.send(err)
                })
        })
        .catch((err) => {
            res.send(err);
        });
};

products_post_review = (req, res) => {
    rev_token = req.data
    if (!req.body.product_id || !req.body.review || !req.body.rating) {
        res.json({
            status: 400,
            message: 'Failed All fild Require'
        })
    } else {
        const giveReview = {
            customer_id: rev_token.customer_id,
            product_id: req.body.product_id,
            review: req.body.review,
            rating: req.body.rating,
            created_on: new Date()
        }
        knexcon('review').insert(giveReview)
            .then((data) => {
                knexcon.select('*').from('review').where('review_id', data)
                    .then(() => {
                        res.status(200)
                    }).catch(() => {
                        res.json({
                            succes: false,
                            message: 'Product Id Not Exits'
                        })
                    })
            })

    }

}

products_by_review = (req, res) => {
    knexcon("review").select('name', 'review', 'rating', 'created_on').
    join("customer", "customer.customer_id", "=", "review.customer_id").
    where({ product_id: req.params.product_id }).
    then((result) => {
            res.send(result);
        })
        .catch((err) => {
            res.send(err);
        });
}

module.exports = { products, product_search, products_by_products_id, products_by_category_id, products_by_department_id, product_by_details, products_by_location, products_post_review, products_by_review }