var inquirer = require("inquirer");
var table = require("table");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "root",
    database: "bamazon_db"
  });
  

function bamazonMenu(){
    connection.query("SELECT * FROM products",function(err,res){
        if (err) throw err;
    for (var i = 0; i < res.length; i++){
        console.log(`${res[i].id} --|-- ${res[i].item} --|-- ${res[i].qty}`)
    }
    connection.end();
    })
    
    // running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
    // inquirer.prompt([
    //     {
    //         name: buyId,
    //         message:"Please enter the ID of the item that you would like to buy.",
    //         type: "input",
    //         validate : function(input){
    //             return parseInt(input) !== NaN
    //         }
    //     },
    //     {
    //         name: qnty,
    //         message: "How much of that item would you like to buy?",
    //         type: "input",
    //         validate: function(input){
    //             return parseInt(input) < 
    //         }
    //     }
    // ]).then(function(user){

    // });
    // The first should ask them the ID of the product they would like to buy.

    // The second message should ask how many units of the product they would like to buy.
    
    // Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
    
    //  If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.
    
    // if your store _does_ have enough of the product, you should fulfill the customer's order.
    // Once the update goes through, show the customer the total cost of their purchase.
    
};

function buyItem(){

};

bamazonMenu();