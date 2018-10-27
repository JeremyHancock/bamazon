//Requiring the necessary packages
var mysql = require("mysql");
var inquirer = require("inquirer");

//Creating the connection to the mySQL databse
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "1234",
    database: "bamazon_DB"
});

//Connects to the database and runs the initial function
connection.connect(function (err) {
    if (err) throw err;
    actions();
});

//Uses inquirer to prompt the user for one of four actions
function actions() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "\n\nWhat would you like to do?\n",
            choices: [
                "View all products",
                "View products with low inventory",
                "Add to inventory",
                "Add a new product",
                "Exit"
            ]
        })
        // Checks the users selection against four possible cases and runs a function based on the match
        .then(function (answer) {
            switch (answer.action) {
                case "View all products":
                    viewProducts();
                    break;

                case "View products with low inventory":
                    viewLow();
                    break;

                case "Add to inventory":
                    addInventory();
                    break;

                case "Add a new product":
                    addProduct();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        });
}
//Makes a call to the database and asks for all rows
function viewProducts() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        console.log("Item #  Product   Department  Price   # in stock\n ----------------------------");
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | ", res[i].product_name + " | ", res[i].department_name + " | ", "$" + res[i].price + " | ", res[i].stock_quantity + "\n ----------------------------");
        }
        setTimeout(actions, 500);
    });
};
//Makes a call to the database and asks for all rows ...
function viewLow() {
    var query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products";
    connection.query(query, function (err, res) {
        console.log("Item #  Product   Department  Price   # in stock\n ----------------------------");
        for (var i = 0; i < res.length; i++) {
            // ... that have < 5 in the stock_quantity column
            if (res[i].stock_quantity < 5) {
                console.log(res[i].item_id + " | ", res[i].product_name + " | ", res[i].department_name + " | ", "$" + res[i].price + " | ", res[i].stock_quantity + "\n ----------------------------");
            }
        }
        setTimeout(actions, 500);
    });
};

function addInventory() {
    //Asks the user for an Item # ... 
    inquirer.prompt([
        {
            name: "item",
            type: "input",
            message: "Please enter the Item # of the product you are adding.",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            // ... and a quantity ...
            name: "quantity",
            type: "input",
            message: "How many are you adding?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ])
        //... and updates those values in the database
        .then(function (answer) {
            var item = parseInt(answer.item);

            var query = "SELECT item_id, product_name, stock_quantity FROM products";
            connection.query(query, function (err, res) {
                if (err) throw err;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].item_id === item) {
                        var query = connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: parseInt(res[i].stock_quantity) + parseInt(answer.quantity)
                                },
                                {
                                    item_id: res[i].item_id
                                }
                            ],
                        )
                        console.log(answer.quantity + " " + res[i].product_name + " have been added to inventory.");
                        setTimeout(actions, 500);
                    }
                }
            });
        });
}
// asks the users for information that will be used for each column in the database
function addProduct() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Please enter the name of the product you are adding.",
        },
        {
            name: "department",
            type: "input",
            message: "Which department will sell this product?",
        },
        {
            name: "price",
            type: "input",
            message: "What is the retail price, to the nearest dollar (numbers only)?",
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
            message: "How many are you adding to inventory?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ])
        .then(function (answer) {
            // Inserts the users responses into the database in the appropriate column, creating a new row, and a new product_id
            var query = connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.name,
                    department_name: answer.department,
                    price: answer.price,
                    stock_quantity: answer.quantity
                },
                function (err, res) {
                    console.log(answer.quantity + " " + answer.name + " have been added to the " + answer.department + " inventory.\n");
                    actions();
                }
            );
        })
}