alert('hello cart!');
// var cart = document.getElementsByClassName("cart");
// cart = cart[0];
// cart.style.visibility = 'hidden';

// var addToCartBtns = document.getElementsByClassName("add-to-cart-btn");
var products = document.getElementsByClassName("description");
const tbody = document.getElementsByTagName('tbody')[0];
const keepShoppingBtn = document.getElementById("keep-shopping");
var cartDiv = document.getElementsByClassName("cart");
cartDiv = cartDiv[0];


var cart = {
    cartItems: [],
    addCartItem: function (cartItem) {
        this.cartItems.push(cartItem);
    },

    printItems: function () {
        for (var i = 0; i < this.cartItems.length; i++) {
            console.log(JSON.stringify(this.cartItems));
        }
    },

    updateCalculation() {
        var total = 0;
        for (var i = 0; i < this.cartItems.length; i++) {
            total += this.cartItems[i].price * this.cartItems[i].quantity;
        }

        return total;
    },

    toggleCart() {
        var cart = document.getElementsByClassName("cart");
        cart = cart[0];

        if (this.cartItems.length > 0) {
            // cart.style.visibility = 'visible';
            showCartDiv();
        } else {
            // cart.style.visibility = 'hidden';
            hideCartDiv();
        }
    },

    updateDisplay() {
        tbody.innerHTML = "";
        for (let i = 0; i < cart.cartItems.length; i++) {
            let newRow = tbody.insertRow(i),
                cartItem = cart.cartItems[i];

            var tempStr = '<div class="image"><img src="http://via.placeholder.com/100x100" alt="product"></div > '

            var newCell = newRow.insertCell(0);
            newCell.innerHTML = tempStr;

            tempStr = '\
            <p class="bold">' + cartItem.name + '</p>\
            <p class="blue">' + cartItem.description + '</p>    \
            '

            // // Insert a cell in the row at index 0 status
            var newCell = newRow.insertCell(1);
            newCell.innerHTML = tempStr;;

            // // Insert a cell in the row at index 0 status
            var newCell = newRow.insertCell(2);
            let sel = document.createElement("select"),
                selDiv = document.createElement("div"),
                opt0 = document.createElement("option"),
                opt1 = document.createElement("option"),
                opt2 = document.createElement("option"),
                opt3 = document.createElement("option"),
                opt4 = document.createElement("option"),
                opt5 = document.createElement("option");

            opt0.value = "0";
            opt0.text = "0";
            opt1.value = "1";
            opt1.text = "1";
            opt2.value = "2";
            opt2.text = "2";
            opt3.value = "3";
            opt3.text = "3";
            opt4.value = "4";
            opt4.text = "4";
            opt5.value = "5";
            opt5.text = "5";

            sel.add(opt0);
            sel.add(opt1);
            sel.add(opt2);
            sel.add(opt3);
            sel.add(opt4);
            sel.add(opt5);

            //just to prevent array bounds error on selected quantities.
            sel.selectedIndex = cartItem.quantity;
            // if (cartItem.quantity > 5) {
            //     sel.selectedIndex = 6;
            // } else {

            // }

            sel.setAttribute("id", "quantity");
            sel.onchange = (function (newRow, cartItemIndex) { return function (event) { quantityHandler(event, cartItemIndex, newRow); } })(newRow, i);
            selDiv.className = "drop-down";

            selDiv.appendChild(sel);
            newCell.appendChild(selDiv);
            // newCell.innerHTML = tempStr;

            tempStr = '\
            <p id="unit-price" class="maroon"> Unit: $' + cartItem.price + '</p><br />\
            <p id="subtotal" class="maroon">Subtotal: $' + cartItem.price * cartItem.quantity + '</p>\
            '

            // // Insert a cell in the row at index 0 status
            var newCell = newRow.insertCell(3);
            newCell.innerHTML = tempStr;

            tempStr = '<button class="remove">Remove</button>'

            // // Insert a cell in the row at index 0 status
            var newCell = newRow.insertCell(4);
            var btn = document.createElement('input');
            btn.type = "button";
            btn.className = "remove";
            btn.value = "Remove";
            btn.onclick = (function (newRow, cartItemIndex) { return function () { deleteNode(newRow, cartItemIndex); } })(newRow, i);
            newCell.appendChild(btn);

        }

        //update calculation display
        cart.updateDisplayPrices();
    },

    updateDisplayPrices() {
        // let totalPriceNode = document.getElementById("total-price");
        let subTotalPriceNode = document.getElementById("subtotal-price");
        // totalPriceNode.innerHTML = '$ ' + cart.updateCalculation();
        subTotalPriceNode.innerHTML = '$ ' + cart.updateCalculation();
    }

}





for (let i = 0; i < products.length; i++) {
    let addToCartBtn = products[i].lastChild.previousSibling;
    addToCartBtn.addEventListener("click", function () {
        console.log('Hello ', i);
        console.log("node details ", products[i])
        let cartItem = getCartItemFromNode(products[i]);
        console.log('typeof cart item ', typeof cartItem.price)
        cart.addCartItem(cartItem);

        console.log(cart.updateCalculation());
        cart.updateDisplay();
        cart.toggleCart();
    })
}

function getCartItemFromNode(node) {
    let productName = node.firstChild.nextSibling,
        productPrice = productName.nextSibling.nextSibling,
        productDescription = productPrice.nextSibling.nextSibling;
    console.log('product name ', productName.innerText, productPrice.innerText, productDescription.innerText);

    let cartItem = {
        name: productName.innerText,
        price: parseFloat(productPrice.innerText.substring(1)),
        quantity: 1,
        description: productDescription.innerText
    }

    return cartItem;
}

function hideCartDiv() {
    cartDiv.style.visibility = "hidden";
}

function showCartDiv() {
    cartDiv.style.visibility = "visible";
}

/*
function to delete row node containing a given cart item. This works by simply deleting 
the value from the cartItem property of the cart object. After that, the updateDisplay() is
called which recreates the cart UI with the relevant updates. It doesn't delete any UI item.
*/
function deleteNode(node, cartItemIndex) {
    // node.innerHTML = "";
    //delete the selected cart item
    if (cartItemIndex > -1) {
        cart.cartItems.splice(cartItemIndex, 1);
    }
    // delete cart.cartItems[cartItemIndex];
    cart.updateDisplay();
    cart.toggleCart();
}

function quantityHandler(event, cartItemIndex, node) {
    let selectValue = parseInt(event.target.value);

    if (selectValue === 0) {
        deleteNode(node, cartItemIndex);
    } else {
        let cartItem = cart.cartItems[cartItemIndex];
        cartItem.quantity = selectValue;

        // cart.cartItems[cartItemIndex].quantity = selectValue;
        console.log(node);
        console.log(node.querySelector("p#subtotal"));
        let total = cartItem.quantity * cartItem.price;
        updateSubtotal(node, total);
    }
}

function updateSubtotal(rowNode, newPriceSubtotal) {
    let subtotalNode = rowNode.querySelector("p#subtotal");
    subtotalNode.innerHTML = "Subtotal: $ " + newPriceSubtotal;
    cart.updateDisplayPrices();
    // console.log('cartItemsArray', JSON.stringify(cart.cartItems))
}

keepShoppingBtn.addEventListener("click", function () {
    hideCartDiv();
})

// // cart.addCartItem({ a: 1, b: 2 });
// // cart.addCartItem({ a: 4, b: 6 });

// cart.printItems();

// console.log(cart.updateCalculation());