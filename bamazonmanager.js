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

  var addItem;
  var addAmount;

 


function managerMenu(){
inquirer.prompt(
    {
        name: "choice",
        type: "rawlist",
        message: "What would you like to do?",
        choices: ["View all products for sale","View Low Inventory","Add inventory","Add a new product","Exit"]
    }).then(function(manager){
        switch (manager.choice){
            case "View all products for sale":
            viewProducts();
            break;

            case "View Low Inventory":
            viewLowProducts();
            break;

            case "Add inventory":
            addInventory();
            break;

            case "Add a new product":
            addProduct();
            break;

            case "Exit":
            connection.end();
            return
        }
        
    })
};

function viewProducts(){
  connection.query("SELECT * FROM products",function(err,res){
    if (err) throw err;
var tableData = [["Item Id","Product","Department","# Left", "Price ($)"]]
for (var i = 0; i < res.length; i++){
    var newArray = [res[i].id,res[i].item,res[i].department,res[i].qty,res[i].price];
    tableData.push(newArray);
}
console.log("\n"+table(tableData));
managerMenu();

});
};

function viewLowProducts(){
    connection.query("SELECT * FROM products WHERE qty < 6",function(err,res){
        if (err) throw err;
    if (res.length === 0){
        console.log("All products are well stocked!")
        managerMenu();
    }

    else {
    var tableData = [["Item Id","Product","Department","# Left", "Price ($)"]]
    for (var i = 0; i < res.length; i++){
        var newArray = [res[i].id,res[i].item,res[i].department,res[i].qty,res[i].price];
        tableData.push(newArray);
    }
    console.log("\n"+table(tableData));
    managerMenu();
    }
    });
};

function addInventory(){
    connection.query("SELECT * FROM products",function(err,res){
        if (err) throw err;
        var products = [];
    for (var k = 0; k < res.length; k++){
        products.push(res[k].item);
    };
        inquirer.prompt([
            {
                name: "addItem",
                type:"rawlist",
                message: "Please select the item that you would like to add more to.",
                choices: products
            },

            {
                name: "qty",
                message: "How much would you like to add?",
                type:"input",  
                validate : function(input){
                    if (!isNaN(parseInt(input))){
                        return true
                    }
                    console.log("\nPlease enter a valid number")
                    }
            }
        ]).then(function(answer){
            addItem =  answer.addItem
            addAmount = parseInt(answer.qty);
            itemAdd(); 
        })
    });
}

function addProduct(){
    inquirer.prompt([
        {
            name: "name",
            message: "What is the product name?"
        },
        {
            name: "department",
            message: "Which department is it in?"
        },
        {
            name: "amount",
            message: "How much is there?"
        },
        {
            name: "price",
            message: "How much does it cost?"
        }
    ]).then(function(answer){
        connection.query(
            "INSERT INTO products SET ?",
            {
              item: answer.name,
              department: answer.department,
              qty : parseInt(answer.amount),
              price : parseFloat(answer.price)
            },
            function(err, res) {
              console.log(res.affectedRows + " product inserted!\n");
              // Call updateProduct AFTER the INSERT completes
              managerMenu();
            }
          );
    })
    
}

function itemAdd(){
    connection.query("SELECT * FROM products WHERE item = ?",[addItem],function(err,res){
        var itemId = res[0].id
        var newTotal = parseInt(res[0].qty) + addAmount;
        connection.query("UPDATE products SET ? WHERE ?",
        [
          {
            qty: newTotal
          },
          {
            id: itemId
          }
        ],function(err,res){
            if (err) {
                console.log(err)
            }
            console.log(`You have sucessfully added ${addAmount} to ${addItem} \nThe New amount is ${newTotal} `)
            managerMenu();
        })  
    })
    };


managerMenu();

