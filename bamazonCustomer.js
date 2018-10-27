var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "1234",
    database: "bamazon_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("These items are available for sale: \n ----------------------------");

    var query = "SELECT item_id, product_name, price FROM products";
    connection.query(query, function (err, res) {
        console.log("Item #  Product   Price \n ----------------------------");
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | ", res[i].product_name + " | ", "$" + res[i].price + "\n ----------------------------");
        }
    });
    purchase();
});

function purchase() {
    inquirer
        .prompt([
            {
                name: "purchase",
                type: "input",
                message: "Please enter the unit number of the product you would like to buy.",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            var query = "SELECT item_id, product_name, price, stock_quantity FROM products";
            connection.query(query, function (err, res) {
                if (err) throw err;
                var purchase = parseInt(answer.purchase);
                var quantity = parseInt(answer.quantity);
                for (var i = 0; i < res.length; i++) {
                    if (res[i].item_id === purchase) {
                        if (quantity < res[i].stock_quantity) {
                            console.log("You have purchased " + quantity + " " + res[i].product_name + ". Your total is $" + (res[i].price * quantity) + ". Thank you!")
                            var query = connection.query(
                                "UPDATE products SET ? WHERE ?",
                                [
                                  {
                                    stock_quantity: res[i].stock_quantity - quantity
                                  },
                                  {
                                    product_name: res[i].product_name
                                  }
                                ],
                            )}
                        else {
                            console.log("I'm sorry. There are only " + res[i].stock_quantity + " available. Please try your purchase again.");
                        }
                    }
                }
            })
        })
}