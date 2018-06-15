/*==========================================================
        Global Variables / Money 
==========================================================*/

// Currency in PENNIES
const dollar = 100;
const quarter = 25;
const dime = 10;
const nickel = 5;
const penny = 1;
//users current amount
var userAmount = 0;
//variable for the current item
var chosenItem = "";
//the api response
var apiResponse = "";

/*==========================================================
        READY FUNCTION
==========================================================*/

//all functions will start when the page is ready
$(document).ready(function () {

    //load items from ajax
    loadInventory();
    //dollar button click event
    dollarBtn();
    //quarter button click event
    quarterBtn();
    //dime button click event
    dimeBtn();
    //nickel button click event
    nickelBtn();
    //click event for 
    clickOnInventoryEvent();
    //start up messages
    startupMessages();
    //finish messages
    makePurchaseBtn();
    //hidden music event
    musicBtn();
});

//displays a default message
function startupMessages() {
    //calling the display variables that target the div and display
    displayMoney("???");
    displayMessage("...");
    displayItemOutput("...");

}

/*==========================================================
        AJAX
==========================================================*/

//object that contains the ajax calls
function ajax() {
    this.loadItems = function (callback) {
        //this is calling ajax
        $.ajax({
            // this is calling the url
            url: "http://localhost:8080/items",
            //using the method to get the json from the url
            method: "GET",
            //javascript object notation
            dataType: "json",
            //this returns an error
            error: function (error) {
                console.log(error);
                displayMessage(error.responseJSON.message);
            }
            //when function is done it will send a response    
        }).done(function (response) {
            //using a callback for the response
            callback(response);


        });
    }
    //ajax call for purchasing an item
    this.purchaseItem = function (callback) {
        $.ajax({
            //calling the url with path variables
            url: "http://localhost:8080/money/" + toDecimal(userAmount) + "/item/" + chosenItem.id,
            //using a get method
            method: "GET",
            //returning json
            dataType: "json",
            //catching the error in order to display
            error: function (error) {
                console.log(error);
                displayMessage(error.responseJSON.message);
            },
            //when ajax call is complete return a response
        }).done(function (response) {
            callback(response);
        });
    }
}

/*==========================================================
        Load Inventory
==========================================================*/

function loadInventory() {
    //call the data service
    var dataService = new ajax();
    //calling ajax and passing through a function to get the response and activate it
    dataService.loadItems(function (response) {
        //assigning the api response into a variable for later use and more flexibility
        apiResponse = response;
        //storing it into another variable for the for each loop
        var inventory = response;
        //scanning the inventory and formatting each object into html and appending
        inventory.forEach(function (item) {
            var html = formatHtml(item);
            $(".stock").append(html);
        });
    });

}


//format function in order to convert into html
function formatHtml(inventory) {
    //storing the objects into variables for legibility
    var id = inventory.id;
    var name = inventory.name;
    var price = inventory.price;
    var quantity = inventory.quantity;
    //returning variables as html
    return `
    <div class="col-sm inventory" data-inventoryId="${id}">
        <p>(${id})</p>
        <p>${name}</p>
        <hr>
        <p>$${price}</p>
        <hr>
        <p id="invo">Quantity: ${quantity}</p>
    </div>
    `;
}

/*==========================================================
        display functions
==========================================================*/

function displayMoney(msg) {
    $(".money-result").text(msg);
}

function displayMessage(msg) {
    $(".message-box").text(msg);
}

function displayItemOutput(msg) {
    $(".item-input").text(msg);
}

function displayChange(msg) {
    $(".change-output").text(msg);
}

function displayItem() {
    displayMessage(chosenItem.name);
}

/*==========================================================
        currency functions
==========================================================*/

function toDecimal(num) {
    return num / 100;
}

function toPennies(num) {
    return num * 100;
}

/*==========================================================
        Buttons
==========================================================*/

function dollarBtn() {
    $(document).on("click", "#dollar", function (event) {
        event.preventDefault();
        userAmount += dollar;
        displayMoney(toDecimal(userAmount));
    });
}

function quarterBtn() {
    $(document).on("click", "#quarter", function (event) {
        event.preventDefault();
        userAmount += quarter;
        displayMoney(toDecimal(userAmount));
    });
}

function dimeBtn() {
    $(document).on("click", "#dime", function (event) {
        event.preventDefault();
        userAmount += dime;
        displayMoney(toDecimal(userAmount));
    });
}

function nickelBtn() {
    $(document).on("click", "#nickel", function (event) {
        event.preventDefault();
        userAmount += nickel;
        displayMoney(toDecimal(userAmount));
    });
}

function clickOnInventoryEvent() {
    $(document).on("click", ".inventory", function (event) {
        chosenItem = "";
        event.preventDefault();
        var btn = $(event.target);
        var id = btn.attr("data-inventoryId");
        displayItemOutput("ID: " + id);
        inventory = getInvoById(apiResponse, id);
        chosenItem = inventory;
        displayItem();
    });
}

function makePurchaseBtn() {
    //when clicking the button activate the events in the button
    $(document).on("click", ".purchase-btn", function (event) {
        event.preventDefault();
        //empty out the div containing the items
        $(".stock").empty();
        //reload the inventory with updated information
        loadInventory();
        //calling the data service to activate the purchase item call
        var dataService = new ajax();
        dataService.purchaseItem(function (response) {
            console.log(response);
            //calling the display functions in order to display the change
            displayChange(response);
            displayChange(` quarters ${response.quarters}
                            dimes ${response.dimes}
                            nickels ${response.nickels}
                            pennies ${response.pennies} `);

        });

        //resetting user amount
        userAmount = 0;
        //displaying the current user amount
        displayMoney(userAmount);
        //console.log(toDecimal(userAmount));
        //console.log(chosenItem);
    });
}

/*==========================================================
        Get inventory By ID
==========================================================*/


//function that scans array and returns the item by id
function getInvoById(array, id) {
    for (var x = 0; x < array.length; x++) {
        if (array[x].id == id) {
            var item = array[x]
            return item;
        }
    }
    return null;
}

/*==========================================================
        hidden music music button
==========================================================*/

function musicBtn() {
    $("#music").hide();                                                         //hides music on start
    $(document).on("click", "#video-btn", function () {                             //button click event
        $("#music").toggle();                                                   //toggles the music on click
    });
}