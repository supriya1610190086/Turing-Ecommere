const environment = process.env.ENVIRONMENT || 'development'
const config = require('../knexfile')[environment];
const knex = require('knex')(config)

//For getting all the departments:

department = function(req, res) {
    knex('department')
        .select('*')
        .then((rows) => {
            res.send(rows)
        })
        .catch((err) => {
            res.json({
                Error: err
            })
        })
}

//For getting department by department_id:

department_by_department_id = function(req, res) {
    knex('department')
        .select('*')
        .where('department_id', req.params.department_id)
        .then((rows) => {
            res.send(rows)
        })
        .catch((err) => {
            res.send(err)
        })
}



module.exports = { department, department_by_department_id }