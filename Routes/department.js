const router = require('express').Router()

const department = require('../Controller/department')
router.get('/department', department.department)
router.get('/department/:department_id', department.department_by_department_id)

module.exports = router