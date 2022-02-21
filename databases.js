// var mysql = require('mysql');

// var con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "Nav@gur1"
// });

// con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     con.query("CREATE DATABASE Ecommerc", function(err, result) {
//         if (err) throw err;
//         console.log("Database created");
//     });
// });


// const options = {
//     client: 'mysql',
//     connection: {
//         host: '127.0.0.1',
//         user: "root",
//         password: "Nav@gur1",
//         database: 'Ecommerc'
//     }
// }
// const knex = require('knex')(options);

// knex.schema.createTable('move_cart', function(table) {

//     table.increments('item_id').primary();
//     table.string('cart_id');
//     table.integer('product_id');
//     table.string('attributes');
//     table.integer('quantity');
//     table.integer('buy_now');
// }).then(() => {
//     console.log("move_cart table created successfully....")
// }).catch(() => {
//     console.log("move_cart table is already exists!");
// })