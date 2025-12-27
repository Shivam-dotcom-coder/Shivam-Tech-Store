let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ id, name, price, qty: 1 });
    }

    saveCart();
    updateNavCart();
}

function updateNavCart() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    document.getElementById('cart-count').textContent = count;
    document.getElementById('nav-total').textContent = total;
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const totalEl = document.getElementById('total');
    if (!cartItems) return;

    cartItems.innerHTML = '';
    let totalPrice = 0;

    cart.forEach((item, index) => {
        totalPrice += item.price * item.qty;

        cartItems.innerHTML += `
            <div class="cart-row">
                <span>${item.name}</span>
                <div class="qty-controls">
                    <button onclick="changeQty(${index}, -1)">−</button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty(${index}, 1)">+</button>
                </div>
                <span>₹${item.price * item.qty}</span>
                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
            </div>
        `;
    });

    totalEl.textContent = totalPrice;
    updateNavCart();
}

function changeQty(index, change) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    saveCart();
    renderCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
}

/* 🔥 ORDER ID GENERATOR */
function generateOrderID() {
    return "ORD-" + Date.now().toString().slice(-6);
}

document.addEventListener('DOMContentLoaded', () => {
    updateNavCart();
    renderCart();

    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', e => {
            const card = e.target.closest('.card');
            addToCart(
                card.dataset.id,
                card.querySelector('h4').textContent,
                parseInt(card.dataset.price)
            );
            window.location.href = "cart.html";
        });
    });

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Cart is empty!");
                return;
            }

            const orderId = generateOrderID();
            cart = [];
            saveCart();

            document.getElementById('cart').innerHTML = `
                <div class="thank-you">
                    <h2>🎉 Thank You, Shivam! 🎉</h2>
                    <img src="WIN_20251213_18_51_30_Pro.jpg" class="thank-img">

                    <p>
                        Your order has been placed successfully!  
                        You are an excellent customer and a future tech leader 🚀
                    </p>

                    <h3>🧾 Order ID: <span style="color:#007bff">${orderId}</span></h3>

                    <button id="track-order" class="add-to-cart">Track Order</button>

                    <div id="tracking-info" style="display:none; margin-top:15px;">
                        🚚 Order <b>${orderId}</b> is being packed.<br>
                        Expected delivery in <b>5–7 days</b>.
                    </div>
                </div>
            `;

            document.getElementById('track-order').onclick = () => {
                document.getElementById('tracking-info').style.display = 'block';
            };

            updateNavCart();
        });
    }
});
