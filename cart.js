alert('hello cart!');
// var cart = document.getElementsByClassName("cart");
// cart = cart[0];
// cart.style.visibility = 'hidden';

// var addToCartBtns = document.getElementsByClassName("add-to-cart-btn");
var products = document.getElementsByClassName("description");
const tbody = document.getElementsByTagName('tbody')[0];
const keepShoppingBtn = document.getElementsByClassName("keep-shopping");



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
            total += this.cartItems[i].price;
        }

        return total;
    },

    toggleCart() {
        var cart = document.getElementsByClassName("cart");
        cart = cart[0];

        if (this.cartItems.length > 0) {
            cart.style.visibility = 'visible';
        } else {
            cart.style.visibility = 'hidden';
        }
    },

    updateDisplay() {
        tbody.innerHTML = "";
        for (let i = 0; i < cart.cartItems.length; i++) {
            var newRow = tbody.insertRow(i),
                cartItem = cart.cartItems[i];

            var tempStr = '<div class="image"><img src="http://via.placeholder.com/100x100" alt="product"></div > '

            var newCell = newRow.insertCell(0);
            // var newText = document.createTextNode(tempStr);
            // // newCell.appendChild(newText);
            newCell.innerHTML = tempStr;

            tempStr = '\
            <p class="bold">' + cartItem.name + '</p>\
            <p class="blue">' + cartItem.description + '</p>    \
            '

            // // Insert a cell in the row at index 0 status
            var newCell = newRow.insertCell(1);
            newCell.innerHTML = tempStr;;

            tempStr = '\
            <div class="drop-down">\
                <select id="quantity">\
                    <option value="1">1</option>\
                    <option value="2">2</option>\
                    <option value="3">3</option>\
                    <option value="4">4</option>\
                    <option value="5">5</option>\
                    <option value="6">6</option>\
                    <option value="7">7</option>\
                    <option value="8">8</option>\
                    <option value="9">9</option>\
                    <option value="10">10</option>\
                    <option value="11">11</option>\
                    <option value="12">12</option>\
                </select >\
            </div >\
            '

            // // Insert a cell in the row at index 0 status
            var newCell = newRow.insertCell(2);
            newCell.innerHTML = tempStr;

            tempStr = '\
            <p class="maroon">$' + cartItem.price + '</p>\
            '

            // // Insert a cell in the row at index 0 status
            var newCell = newRow.insertCell(3);
            newCell.innerHTML = tempStr;

            tempStr = '<button class="remove">Remove</button>'

            // // Insert a cell in the row at index 0 status
            var newCell = newRow.insertCell(4);
            newCell.innerHTML = tempStr;

        }

        //update calculation display
        let totalPriceNode = document.getElementById("total-price");
        totalPriceNode.innerHTML = '$ ' + cart.updateCalculation();
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
        description: productDescription.innerText
    }

    return cartItem;
}



// cart.addCartItem({ a: 1, b: 2 });
// cart.addCartItem({ a: 4, b: 6 });

cart.printItems();

console.log(cart.updateCalculation());