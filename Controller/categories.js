const environment = process.env.ENVIRONMENT || 'development'
const config = require('../knexfile')[environment];
const knex = require('knex')(config)

//For getting all the categories:

categories = (req, res) => {
    knex.select("*").from("category")
        .then((rows) => {
            if (req.query.order == undefined) {
                req.query.order = "asc"
            }
            if (req.query.page == undefined) {
                req.query.page = 1
            }
            if (req.query.limit == undefined) {
                req.query.limit = 20
            }
            knex("category").count("category_id")
                .then((count) => {
                    knex.select("*").from("category").offset((req.query.page - 1) * req.query.limit).limit(req.query.limit)
                        .then((rows) => {
                            res.send({
                                count: count[0]['count(`category_id`)'],
                                rows: rows
                            })
                        })
                        .catch((err) => {
                            res.send(err)
                        })
                })
        })
        .catch((err) => {
            res.send(err);
        });
};

//For getting the categories by category_id:

categories_by_category_id = function(req, res) {
    knex('category')
        .select('category.category_id', 'category.name', 'category.description', 'category.department_id')
        .where('category_id', req.params.category_id)
        .then((rows) => {
            res.send(rows)
        })
        .catch((err) => {
            res.send(err)
        })
}

//For getting the categories by product_id:

categories_by_product_id = function(req, res) {
    knex('category')
        .select('category.category_id', 'category.department_id', 'category.name')
        .join('product_category', 'category.category_id', '=', 'product_category.category_id')
        .where('product_category.product_id', req.params.product_id)
        .then((rows) => {
            res.send(rows);
        }).catch((err) => {
            res.send(err);
        })
}

//For getting the categories by department_id:

categories_by_department_id = (req, res) => {
    knex.select('category.category_id', 'category.name', 'category.description', 'category.department_id').from("category").where({ department_id: req.params.department_id }).
    then((rows) => {
            knex.select('category.category_id', 'category.name', 'category.description', 'category.department_id').from("category").where({ department_id: rows[0]["department_id"] }).
            then((data) => {
                    res.send(data)
                })
                .catch((err) => {
                    res.send(err)
                });
        })
        .catch((err) => {
            res.send(err);
        });
};

module.exports = { categories, categories_by_category_id, categories_by_product_id, categories_by_department_id }





//(page-1)*limit