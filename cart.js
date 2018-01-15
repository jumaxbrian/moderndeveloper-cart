//declare nodes for the various buttons which need listeners
var products = document.getElementsByClassName("description");
const tbody = document.getElementsByTagName('tbody')[0];
const keepShoppingBtn = document.getElementById("keep-shopping");
var cartDiv = document.getElementsByClassName("cart");
cartDiv = cartDiv[0];
const applyCouponBtn = document.getElementById("apply-coupon");
const toggleCartImg = document.getElementById("toggle-cart-img");


var cart = {

    cartItems: [],  //array containing cart items

    //add an item object to the cart
    addCartItem: function (cartItem) {
        this.cartItems.push(cartItem);
    },

    //calculate total cost of cart items
    updateCalculation() {
        var total = 0;
        for (var i = 0; i < this.cartItems.length; i++) {
            total += this.cartItems[i].price * this.cartItems[i].quantity;
        }

        return total;
    },

    //toggle shopping cart based on number of items in the cart
    toggleCart() {
        var cart = document.getElementsByClassName("cart");
        cart = cart[0];

        if (this.cartItems.length > 0) {
            showCartDiv();
        } else {
            hideCartDiv();
        }
    },

    //Build up the shopping card display
    updateDisplay() {
        tbody.innerHTML = "";
        for (let i = 0; i < cart.cartItems.length; i++) {
            let newRow = tbody.insertRow(i),
                cartItem = cart.cartItems[i];

            // Insert a cell in the row at index 0 
            var tempStr = '<div class="image"><img src="http://via.placeholder.com/100x100" alt="product"></div > ';
            var newCell = newRow.insertCell(0);
            newCell.innerHTML = tempStr;

            // Insert a cell in the row at index 1
            tempStr = '\
            <p class="bold">' + cartItem.name + '</p>\
            <br/><p class="bold-product-type">' + cartItem.type + '</p>\
            <p class="blue">' + cartItem.description + '</p>    \
            ';

            var newCell = newRow.insertCell(1);
            newCell.innerHTML = tempStr;

            // Insert a cell in the row at index 2
            var newCell = newRow.insertCell(2);
            let sel = document.createElement("select"),
                selDiv = document.createElement("div"),
                opt0 = document.createElement("option"),
                opt1 = document.createElement("option"),
                opt2 = document.createElement("option"),
                opt3 = document.createElement("option"),
                opt4 = document.createElement("option"),
                opt5 = document.createElement("option");

            //assign values and texts to options
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

            //add options to select object
            sel.add(opt0);
            sel.add(opt1);
            sel.add(opt2);
            sel.add(opt3);
            sel.add(opt4);
            sel.add(opt5);

            //add attributes to select object
            sel.selectedIndex = cartItem.quantity;
            sel.setAttribute("id", "quantity");
            sel.onchange = (function (newRow, cartItemIndex) { return function (event) { quantityHandler(event, cartItemIndex, newRow); } })(newRow, i);

            selDiv.className = "drop-down";
            selDiv.appendChild(sel);
            newCell.appendChild(selDiv);

            // Insert a cell in the row at index 3
            tempStr = '\
            <p id="unit-price" class="maroon"> Unit: $' + cartItem.price + '</p><br />\
            <p id="subtotal" class="maroon">Subtotal: $' + cartItem.price * cartItem.quantity + '</p>\
            ';

            var newCell = newRow.insertCell(3);
            newCell.innerHTML = tempStr;

            // Insert a cell in the row at index 4
            tempStr = '<button class="remove">Remove</button>';

            var newCell = newRow.insertCell(4);
            var btn = document.createElement('input');
            btn.type = "button";
            btn.className = "remove";
            btn.value = "Remove";
            btn.onclick = (function (newRow, cartItemIndex) { return function () { deleteNode(newRow, cartItemIndex); } })(newRow, i);
            newCell.appendChild(btn);

        }


        cart.updateDisplayPrices(null);
    },

    //update prices displayed on the shopping cart view
    updateDisplayPrices(newPrice) {
        let subTotalPriceNode = document.getElementById("subtotal-price");

        if (newPrice === null) {
            subTotalPriceNode.innerHTML = '$ ' + cart.updateCalculation().toFixed(2);
        } else {
            subTotalPriceNode.innerHTML = '$ ' + newPrice.toFixed(2);
        }
    }

}


for (let i = 0; i < products.length; i++) {
    let addToCartBtn = products[i].lastChild.previousSibling;
    addToCartBtn.addEventListener("click", function () {
        let cartItem = getCartItemFromNode(products[i]);
        cart.addCartItem(cartItem);
        cart.updateDisplay();
        cart.toggleCart();
    })
}

function getCartItemFromNode(node) {
    let productName = node.firstChild.nextSibling,
        productType = productName.nextSibling.nextSibling,
        productPrice = productType.nextSibling.nextSibling,
        productDescription = productPrice.nextSibling.nextSibling;

    let cartItem = {
        name: productName.innerText,
        type: productType.innerText,
        price: parseFloat(productPrice.innerText.substring(1)),
        quantity: 1,
        description: productDescription.innerText,
        couponApplied: false,
        couponName: "",
        couponDiscount: 0
    }

    return cartItem;
}

function hideCartDiv() {
    cartDiv.style.visibility = "hidden";
}

function showCartDiv() {
    cartDiv.style.visibility = "visible";
}

function toggleCart() {
    if (cartDiv.style.visibility == "hidden") {
        showCartDiv();
    } else {
        hideCartDiv();
    }
}

/*
function to delete row node containing a given cart item. This works by simply deleting 
the value from the cartItem property of the cart object. After that, the updateDisplay() is
called which recreates the cart UI with the relevant updates. It doesn't delete any UI item.
*/
function deleteNode(node, cartItemIndex) {

    //delete the selected cart item
    if (cartItemIndex > -1) {
        cart.cartItems.splice(cartItemIndex, 1);
    }

    cart.updateDisplay();
    cart.toggleCart();
}

//Handler for product quantity selections i.e. 0 -> hide cart, >=1 update price
function quantityHandler(event, cartItemIndex, node) {
    let selectValue = parseInt(event.target.value);

    if (selectValue === 0) {
        deleteNode(node, cartItemIndex);
    } else {
        let cartItem = cart.cartItems[cartItemIndex];
        cartItem.quantity = selectValue;
        let total = cartItem.quantity * cartItem.price;
        updateSubtotal(node, total);
    }
}

// updates the total price on the cart display
function updateSubtotal(rowNode, newPriceSubtotal) {
    let subtotalNode = rowNode.querySelector("p#subtotal");
    subtotalNode.innerHTML = "Subtotal: $ " + newPriceSubtotal;
    cart.updateDisplayPrices(null);

}

//Determines whether the proposed coupon is better/cheaper for the customer than the already applied one
function isBetterCoupon(nextDiscount) {
    let ans = false;
    if (cart.couponDiscount >= nextDiscount) {
        let error = "A coupon " + cart.couponName + ", which is better than the current one, has already been applied."
        alert(error);

    } else {
        ans = true;
    }

    return ans;
}


keepShoppingBtn.addEventListener("click", function () {
    hideCartDiv();
});

toggleCartImg.addEventListener("click", function () {
    toggleCart();
})


applyCouponBtn.addEventListener("click", function () {

    //get coupon, product type(or name for one item coupon), and coupon info node for displaying discount amounts
    let couponNode = document.getElementById("coupon"),
        couponValue = couponNode.value.toUpperCase().trim(),
        couponInfoNode = document.getElementById("coupon-info"),
        productTypeValue = document.getElementById("product-type").value.trim();

    //ensure product type/name is provided for all other types of coupons exept TOTALORDER
    if ((couponValue !== 'TOTALORDER') && (productTypeValue.length < 3)) {
        alert("Please enter a relevant product type.");
    }

    if (couponValue === 'TOTALORDER') {
        let totalPrice = cart.updateCalculation(),
            couponDiscount = 0.05 * totalPrice,
            couponInfo = "5% discount on total order is $ " + couponDiscount;

        let isCheaper = isBetterCoupon(couponDiscount);
        if (!isCheaper) {
            return; //i.e. no need to replace the current coupon with the new one
        }

        cart.couponApplied = true;
        cart.couponDiscount = couponDiscount;
        cart.couponName = 'TOTALORDER';
        cart.updateDisplayPrices(totalPrice - couponDiscount);
        couponInfoNode.innerHTML = couponInfo;

    } else if (couponValue === 'ONEITEM') {
        for (let i = 0; i < cart.cartItems.length; i++) {
            let cartItem = cart.cartItems[i];

            //find whether the given item is in the cart
            if (cartItem.name.toUpperCase() === productTypeValue.toUpperCase()) {
                let totalPrice = cart.updateCalculation(),
                    couponDiscount = 0.1 * cartItem.price,
                    couponInfo = "10% discount on a single item " + cartItem.name + " is $ " + couponDiscount;

                let isCheaper = isBetterCoupon(couponDiscount);
                if (!isCheaper) {
                    return;
                }

                cart.couponApplied = true;
                cart.couponDiscount = couponDiscount;
                cart.couponName = 'ONEITEM';
                cart.updateDisplayPrices(totalPrice - couponDiscount);

                couponInfoNode.innerHTML = couponInfo;

                break;
            } else {
                alert("There is no product named " + productTypeValue + " in your cart items.");
            }
        }

    } else if (couponValue === 'ALLITEMS') {
        let productTypeTotal = 0;

        for (let i = 0; i < cart.cartItems.length; i++) {
            let cartItem = cart.cartItems[i];

            //find whether the given product type exists in the cart
            if (cartItem.type.toUpperCase() === productTypeValue.toUpperCase()) {
                productTypeTotal += cartItem.price * cartItem.quantity;

            } else {
                alert("There is no product type " + productTypeValue + " in your cart items.");
            }
        }

        //calculate discount if items of a particular product type have a cost greater than 0
        if (productTypeTotal > 0) {
            let totalPrice = cart.updateCalculation(),
                couponDiscount = 0.15 * productTypeTotal,
                couponInfo = "15% discount on all items " + productTypeValue + " is $ " + couponDiscount;

            let isCheaper = isBetterCoupon(couponDiscount);
            if (!isCheaper) {
                return;
            }

            cart.couponApplied = true;
            cart.couponDiscount = couponDiscount;
            cart.couponName = 'ALLITEMS';
            cart.updateDisplayPrices(totalPrice - couponDiscount);

            couponInfoNode.innerHTML = couponInfo;
        }

    }

})
