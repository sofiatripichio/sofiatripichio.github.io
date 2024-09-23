let cartTotal = 0;
let cartItems = {}; // Objeto para almacenar los productos y sus cantidades

function addToCart(price, productId) {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = parseInt(quantityInput.value);
    const itemTotal = price * quantity;

    // Verifica si el producto ya está en el carrito
    if (cartItems[productId]) {
        cartItems[productId].quantity += quantity;
    } else {
        cartItems[productId] = { price: price, quantity: quantity };
    }

    // Actualiza el total del carrito
    cartTotal += itemTotal;
    document.getElementById('cartTotalDisplay').innerText = cartTotal;

    // Actualiza el conteo de productos en el icono del carrito
    const cartCount = document.getElementById('cartCount');
    cartCount.innerText = Object.values(cartItems).reduce((sum, item) => sum + item.quantity, 0);

    // Muestra los productos en el carrito
    updateCartDisplay();

    // Calcula y muestra el total con descuento
    const discountRate = 0.25; // 25% de descuento
    const discountedTotal = cartTotal * (1 - discountRate);
    document.getElementById('discountedTotal').innerText = discountedTotal.toFixed(2);

    alert(`Añadido al carrito. Total de ${productId}: $${itemTotal}`);
}

function updateCartDisplay() {
    const cartItemsList = document.getElementById('cartItemsList');
    cartItemsList.innerHTML = ''; // Limpia la lista actual

    for (const [productId, details] of Object.entries(cartItems)) {
        const productName = getProductName(productId); // Llama a la función para obtener el nombre
        const li = document.createElement('li');
        li.innerText = `${productName}: ${details.quantity} unidad${details.quantity > 1 ? 'es' : ''}`;
        cartItemsList.appendChild(li);
    }
}

// Función para obtener el nombre del producto según su ID
function getProductName(productId) {
    const productNames = {
        product1: 'Gratia Plena',
        product2: 'Hydroserum',
        product3: 'Bruma Be Fresh'
    };
    return productNames[productId] || productId; // Devuelve el nombre o el ID si no se encuentra
}



function toggleCart() {
    const cartDetails = document.getElementById('cartDetails');
    cartDetails.style.display = cartDetails.style.display === 'block' ? 'none' : 'block';
}

function buyProduct(productName, price) {
    const productLinks = {
        "Producto 1": "https://www.mercadolibre.com.ar/producto1-link",
        "Producto 2": "https://www.mercadolibre.com.ar/producto2-link",
        "Producto 3": "https://www.mercadolibre.com.ar/producto3-link"
    };

    window.open(productLinks[productName], '_blank'); // Enlace a Mercado Libre
}

function sendCart() {
    // Aquí puedes agregar la lógica para enviar el carrito a Formspree
    alert("Carrito enviado.");
}
