var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: "8889",
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.log("item \tproduct \tprice");
    for (var i = 0; i < res.length; i++) {
        console.log(res[i].item + " \t" + res[i].product + "\t" + res[i].price);
    }

    inquirer.prompt([
        {
        name: "item",
        type: "input",
        message: "what item would u like to purchase? [don't want anything? press X]"
        },
        {
            name: "qty",
            type: "input",
            message: "how many would u like to purchase?"

        }
        ]).then(function (productObj) {
        if (productObj.item.toUpperCase() == "X") {
            connection.end();
        } else {
            connection.query('SELECT * FROM products WHERE ?', { item: productObj.item }, function (err, res) {
                if (err) throw err;
                // console.log(res)
                if (res[0].stock > productObj.qty) {

                    var cost = res[0].price * productObj.qty
                    console.log("thanks for ur order! ur total is " + cost);

                    var newQty = res[0].stock - productObj.qty

                    connection.query("UPDATE products SET ? WHERE ?", [{
                            stock: newQty
                        },
                            {
                                item: productObj.item
                            }],

                        function (err, res) {
                        });
                }
                else {
                    console.log("sorry, we don't have that many! \nwe only have " + res[0].stock + ". \nplease try again.")
                }
            })
        }
    })
});
