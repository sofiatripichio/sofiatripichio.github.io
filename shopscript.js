
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
    document.getElementById('cartTotalDisplay').innerText = cartTotal.toFixed(2); // Formato de dos decimales

    // Actualiza el conteo de productos en el icono del carrito
    const cartCount = document.getElementById('cartCount');
    cartCount.innerText = Object.values(cartItems).reduce((sum, item) => sum + item.quantity, 0);

    // Muestra los productos en el carrito
    updateCartDisplay();

    // Guarda el carrito en localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Calcula y muestra el total con descuento
    const discountRate = 0.25; // 25% de descuento
    const discountedTotal = cartTotal * (1 - discountRate);
    document.getElementById('discountedTotal').innerText = discountedTotal.toFixed(2);

    alert(`Añadido al carrito. Total de ${productId}: $${itemTotal.toFixed(2)}`);
}

function updateCartDisplay() {
    const cartItemsList = document.getElementById('cartItemsList');
    cartItemsList.innerHTML = ''; // Limpia la lista actual

    for (const [productId, details] of Object.entries(cartItems)) {
        const productName = getProductName(productId); // Llama a la función para obtener el nombre
        const li = document.createElement('li');
        li.innerText = `${productName}: ${details.quantity} unidad${details.quantity > 1 ? 'es' : ''} - $${(details.price * details.quantity).toFixed(2)}`;
        cartItemsList.appendChild(li);
    }
}

function redirectToCheckout() {
    window.location.href = 'checkout.html'; // Redirige a la página de checkout
}

// Función para obtener el nombre del producto según su ID
function getProductName(productId) {
    const productNames = {
        product1: 'Gratia Plena',
        product2: 'Hydroserum',
        product3: 'Be Fresh'
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
    alert("Carrito enviado.");
}

// Abre el modal y muestra la información y video del producto
function showInfo(productId) {
    const productInfo = {
        product1: {
            name: 'Gratia Plena',
            info: 'Ingredientes: ...\nBeneficios: ...\nTipo de piel: ...\nModo de uso: ...',
            video: 'homemulti/GratiaPlena.mp4'
        },
        product2: {
            name: 'Hydroserum',
            info: 'Ingredientes: ...\nBeneficios: ...\nTipo de piel: ...\nModo de uso: ...',
            video: 'homemulti/Hydroserum.mp4'
        },
        product3: {
            name: 'Bruma Be Fresh',
            info: 'Ingredientes: ...\nBeneficios: ...\nTipo de piel: ...\nModo de uso: ...',
            video: 'homemulti/BeFresh.mp4'
        }
    };

    const modal = document.getElementById('modalInfo');
    const productInfoDiv = document.getElementById('product-info');
    const modalVideo = document.getElementById('modal-video');

    // Actualiza el contenido del modal con la información del producto
    productInfoDiv.innerText = productInfo[productId].info;
    modalVideo.src = productInfo[productId].video;

    // Establece el tamaño del video más pequeño
    modalVideo.style.width = "300px";
    modalVideo.style.height = "auto";

    modal.style.display = 'flex'; // Muestra el modal
}

// Cierra el modal
function closeModal() {
    const modal = document.getElementById('modalInfo');
    modal.style.display = 'none';
    document.getElementById('modal-video').pause(); // Pausa el video al cerrar el modal
}

// Función para mostrar el resumen del carrito en la página de checkout
function displayCartSummary() {
    const cartItemsList = document.getElementById('cartItemsList');
    cartItemsList.innerHTML = ''; // Limpia la lista actual

    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || {};
    let total = 0;

    for (const [productId, details] of Object.entries(storedCartItems)) {
        const productName = getProductName(productId);
        const itemTotal = details.price * details.quantity;
        total += itemTotal;

        const li = document.createElement('li');
        li.innerText = `${productName}: ${details.quantity} unidad${details.quantity > 1 ? 'es' : ''} - $${itemTotal.toFixed(2)}`;
        cartItemsList.appendChild(li);
    }

    document.getElementById('cartTotalDisplay').innerText = total.toFixed(2); // Muestra el total con formato
}

// Evento para el envío del formulario de checkout
document.getElementById('checkoutForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el envío normal del formulario

    const formData = new FormData(event.target);
    const orderData = {
        name: formData.get('name'),
        surname: formData.get('surname'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        postal: formData.get('postal'),
        shipping: formData.get('shipping'),
        cart: JSON.parse(localStorage.getItem('cartItems')) || {} // Recupera el carrito del localStorage
    };

    // Convierte el carrito en un formato legible para el correo
    let cartDetails = '';
    for (const [productId, details] of Object.entries(orderData.cart)) {
        const productName = getProductName(productId);
        cartDetails += `${productName}: ${details.quantity} unidad${details.quantity > 1 ? 'es' : ''} - $${(details.price * details.quantity).toFixed(2)}\n`;
    }

    // Prepara los datos que se enviarán a Formspree
    const dataToSend = {
        name: orderData.name,
        surname: orderData.surname,
        email: orderData.email,
        phone: orderData.phone,
        address: orderData.address,
        postal: orderData.postal,
        shipping: orderData.shipping,
        cart: cartDetails // Agrega el carrito formateado al email
    };

    // Enviar a Formspree
    fetch('https://formspree.io/f/xkgwllgb', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend) // Convierte los datos a JSON
    })
    .then(response => {
        if (response.ok) {
            alert('Pedido enviado con éxito');
            // Redirige a otra página si lo deseas
            window.location.href = 'gracias.html'; // Cambia a la página que desees
        } else {
            alert('Error al enviar el pedido. Intenta nuevamente.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ocurrió un error al enviar el pedido. Por favor, intenta más tarde.');
    });
});

// Llama a la función para mostrar el resumen del carrito al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    displayCartSummary();
});
