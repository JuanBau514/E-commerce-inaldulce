document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');

    // Cargar el carrito desde el local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Función para actualizar el carrito en el DOM
    function updateCart() {
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            let total = 0;

            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <p>${item.name}</p>
                    <p>$${item.price}</p>
                    <p>Cantidad: ${item.quantity}</p>
                    <button class="remove-from-cart" data-id="${item.id}"><i class="bx bx-trash"></i></button>
                `;
                cartItemsContainer.appendChild(itemElement);
                total += item.price * item.quantity;
            });

            cartTotalElement.textContent = total;
        }
    }

    // Función para agregar un producto al carrito
    function addToCart(id, name, price, image) {
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id, name, price, image, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }

    // Función para eliminar un producto del carrito
    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }

    // Event listener para agregar productos al carrito
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            const image = this.getAttribute('data-image');
            addToCart(id, name, price, image);
        });
    });

    // Event listener para eliminar productos del carrito
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', function(event) {
            if (event.target.classList.contains('remove-from-cart') || event.target.closest('.remove-from-cart')) {
                const id = parseInt(event.target.closest('.remove-from-cart').getAttribute('data-id'));
                removeFromCart(id);
            }
        });
    }

    // Event listener para el botón de checkout
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            alert('Procediendo al pago...');
            // Aquí puedes añadir la lógica para el proceso de pago
        });
    }

    // Inicializar el carrito en el DOM
    updateCart();
});