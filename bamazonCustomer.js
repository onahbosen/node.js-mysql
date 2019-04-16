var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

function shop(){
    inquirer
        .prompt([
            {
                type: "confirm",
                message: "do u wanna see what we have in stock??",
                name: "confirm",
                default: true
            }
        ])
        .then(function(inquirerResponse) {
            if (inquirerResponse.confirm) {
                console.log("ok!");
                console.log(connection.query('SELECT * FROM products', (err,rows) => {
                    if(err) throw err;
                    console.log('Data received from Db:\n');
                    console.log(rows);
                }));
            }
            else {
                console.log("ok nvm!");
            }
        });
};

shop();