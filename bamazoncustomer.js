var inquirer = require("inquirer");
const {table} = require('table')
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
  });
  

var buyID

function displayTable(){
    connection.query("SELECT * FROM products",function(err,res){
        if (err) throw err;

    for (var i = 0; i < res.length; i++){
        var newArray = [res[i].id,res[i].item,res[i].department,res[i].qty,res[i].price];
        tableData.push(newArray);
    }
    console.log("\n"+table(tableData));

    });
};

function bamazonMenu(){
    // running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
    var tableData = [["Item Id","Product","Department","# Left", "Price ($)"]];

     // The first should ask them the ID of the product they would like to buy.  
     connection.query("SELECT * FROM products",function(err,res){
        if (err) throw err;
    var itemIDs = [];
    for (var i = 0; i < res.length; i++){
        var newArray = [res[i].id,res[i].item,res[i].department,res[i].qty,res[i].price];
        tableData.push(newArray);
        itemIDs.push(res[i].id)
    }
    console.log("\n"+table(tableData));

    
    inquirer.prompt([
        {
            name: "buyId",
            message:"Please enter the ID of the item that you would like to buy.",
            type: "input",
            validate : function(input){
                if (!isNaN(parseInt(input)) && itemIDs.includes(parseInt(input))){
                    return true
                }
                console.log("\nPlease enter a valid number")
            }
        }
    ]).then(function(user){
        buyID = user.buyId
        buyItem();
    });
    });
    };
    
    
       // The second message should ask how many units of the product they would like to buy.
    function buyItem(){
        connection.query("SELECT * FROM products WHERE id = ?",[buyID],function(err,res){
            if (err) throw err

            var item = res[0].item

            inquirer.prompt(
                {
                    name: "qty",
                    type: "input",
                    message: `How much of ${res[0].item} would you like to buy?`,
                    validate: function(input){
                        if(!isNaN(parseInt(input)) && parseInt(input) <= parseInt(res[0].qty)){
                            return true;
                        }
                        else if (isNaN(parseInt(input))){
                            console.log("\nPlease enter a number.");
                        }
                        else if (parseInt(input) > parseInt(res[0].qty)){
                            console.log("\nThat is more than we have!")
                        }
                    }
                }
        ).then(function(user){
            var buyAmount = parseInt(user.qty);
            var price = parseFloat(res[0].price)
            var newTotal = parseInt(res[0].qty) - buyAmount;
            connection.query("UPDATE products SET ? WHERE ?",
            [
              {
                qty: newTotal
              },
              {
                id: buyID
              }
            ],function(err,res){
                if (err) {
                    console.log(err)
                }
                console.log(`You have sucessfully bought $${price * buyAmount} worth of ${item} `)
                connection.end();
            })  
        })
        });
    
    };

    
    // Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
    
    //  If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.
    
    // if your store _does_ have enough of the product, you should fulfill the customer's order.
    // Once the update goes through, show the customer the total cost of their purchase.
    
bamazonMenu();