const environment = process.env.ENVIRONMENT || 'development'
const config = require('../knexfile')[environment];
const knex = require('knex')(config)

//For getting all the tax:

tax = function(req, res) {
    knex('tax')
        .select('*')
        .then((rows) => {
            res.send(rows)
        })
        .catch((err) => {
            res.send(err)
        })
}

//For getting tax by tax_id:

tax_by_tax_id = function(req, res) {
    knex('tax')
        .select('tax.tax_id', 'tax.tax_type', 'tax.tax_percentage')
        .where('tax.tax_id', req.params.tax_id)
        .then((rows) => {
            res.send(rows)
        })
        .catch((err) => {
            res.send(err)
        })
}

module.exports = { tax, tax_by_tax_id }