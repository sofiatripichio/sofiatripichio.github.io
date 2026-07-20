const DISCOUNT_RATE = 0.10; // 10% de descuento por transferencia

let cartItems = loadCart();
let cartTotal = calculateCartTotal(cartItems);


/* ==============================
   FUNCIONES GENERALES DEL CARRITO
================================= */

// Recupera el carrito guardado
function loadCart() {
    try {
        return JSON.parse(localStorage.getItem('cartItems')) || {};
    } catch (error) {
        console.error('Error al recuperar el carrito:', error);
        return {};
    }
}


// Guarda el carrito
function saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}


// Calcula el subtotal del carrito
function calculateCartTotal(items) {
    return Object.values(items).reduce((total, item) => {
        return total + Number(item.price) * Number(item.quantity);
    }, 0);
}


// Formatea los precios con dos decimales
function formatAmount(amount) {
    return Number(amount).toFixed(2);
}


/* ==============================
   AGREGAR PRODUCTOS
================================= */

function addToCart(price, productId) {
    const quantityInput = document.getElementById(`quantity-${productId}`);

    if (!quantityInput) {
        console.error(`No se encontró quantity-${productId}`);
        return;
    }

    const quantity = parseInt(quantityInput.value, 10);

    if (Number.isNaN(quantity) || quantity < 1) {
        alert('Seleccioná una cantidad válida.');
        return;
    }

    if (cartItems[productId]) {
        cartItems[productId].quantity += quantity;
    } else {
        cartItems[productId] = {
            price: Number(price),
            quantity: quantity
        };
    }

    cartTotal = calculateCartTotal(cartItems);

    saveCart();
    updateCartCount();
    updateCartDisplay();
    updateTotals();

    const productName = getProductName(productId);
    const itemTotal = Number(price) * quantity;

    alert(
        `Añadido al carrito: ${productName}. Total: $${formatAmount(itemTotal)}`
    );
}


/* ==============================
   MOSTRAR CARRITO
================================= */

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');

    if (!cartCount) {
        return;
    }

    const totalQuantity = Object.values(cartItems).reduce(
        (sum, item) => sum + Number(item.quantity),
        0
    );

    cartCount.innerText = totalQuantity;
}


function updateCartDisplay() {
    const cartItemsList = document.getElementById('cartItemsList');

    if (!cartItemsList) {
        return;
    }

    cartItemsList.innerHTML = '';

    if (Object.keys(cartItems).length === 0) {
        const li = document.createElement('li');
        li.innerText = 'El carrito está vacío.';
        cartItemsList.appendChild(li);
        return;
    }

    for (const [productId, details] of Object.entries(cartItems)) {
        const productName = getProductName(productId);
        const itemTotal = Number(details.price) * Number(details.quantity);

        const li = document.createElement('li');

        li.innerText =
            `${productName}: ${details.quantity} ` +
            `unidad${details.quantity > 1 ? 'es' : ''} ` +
            `- $${formatAmount(itemTotal)}`;

        cartItemsList.appendChild(li);
    }
}


// Actualiza subtotal y total con descuento
function updateTotals() {
    cartTotal = calculateCartTotal(cartItems);

    const discountedTotal = cartTotal * (1 - DISCOUNT_RATE);

    const cartTotalDisplay =
        document.getElementById('cartTotalDisplay');

    const discountedTotalDisplay =
        document.getElementById('discountedTotal');

    if (cartTotalDisplay) {
        cartTotalDisplay.innerText = formatAmount(cartTotal);
    }

    if (discountedTotalDisplay) {
        discountedTotalDisplay.innerText =
            formatAmount(discountedTotal);
    }
}


/* ==============================
   NOMBRES DE LOS PRODUCTOS
================================= */

function getProductName(productId) {
    const productNames = {
        product1: 'Gratia Plena',
        product2: 'Hydroserum',
        product3: 'Bruma Be Fresh',
        product4: 'Dermafix',
        product5: 'Revital Eyes'
    };

    return productNames[productId] || productId;
}


/* ==============================
   ABRIR Y CERRAR CARRITO
================================= */

function toggleCart() {
    const cartDetails = document.getElementById('cartDetails');

    if (!cartDetails) {
        return;
    }

    cartDetails.style.display =
        cartDetails.style.display === 'block'
            ? 'none'
            : 'block';
}


function redirectToCheckout() {
    window.location.href = 'checkout.html';
}


/* ==============================
   ENLACES A MERCADO LIBRE
================================= */

function buyProduct(productName) {
    const productLinks = {
        'Producto 1': 'https://www.mercadolibre.com.ar/producto1-link',
        'Producto 2': 'https://www.mercadolibre.com.ar/producto2-link',
        'Producto 3': 'https://www.mercadolibre.com.ar/producto3-link'
    };

    const productLink = productLinks[productName];

    if (productLink) {
        window.open(productLink, '_blank');
    }
}


function sendCart() {
    alert('Carrito enviado.');
}


/* ==============================
   MODAL DE INFORMACIÓN
================================= */

function showInfo(productId) {
    const productInfo = {
        product1: {
            name: 'Gratia Plena',
            info: 'Información de Gratia Plena.',
            video: 'homemulti/GratiaPlena.mp4'
        },

        product2: {
            name: 'Hydroserum',
            info: 'Información de Hydroserum.',
            video: 'homemulti/Hydroserum.mp4'
        },

        product3: {
            name: 'Bruma Be Fresh',
            info: 'Información de Bruma Be Fresh.',
            video: 'homemulti/BeFresh.mp4'
        },

        product4: {
            name: 'Dermafix',
            info: 'Información de Dermafix.',
            video: 'homemulti/Dermafix video.mov'
        },

        product5: {
            name: 'Revital Eyes',
            info: 'Información de Revital Eyes.',
            video: 'homemulti/Revital Eyes video.mov'
        }
    };

    const selectedProduct = productInfo[productId];

    if (!selectedProduct) {
        return;
    }

    const modal = document.getElementById('modalInfo');
    const productInfoDiv =
        document.getElementById('product-info');
    const modalVideo =
        document.getElementById('modal-video');

    if (!modal || !productInfoDiv || !modalVideo) {
        return;
    }

    productInfoDiv.innerText = selectedProduct.info;
    modalVideo.src = selectedProduct.video;

    modalVideo.style.width = '300px';
    modalVideo.style.height = 'auto';

    modal.style.display = 'flex';
}


function closeModal() {
    const modal = document.getElementById('modalInfo');
    const modalVideo =
        document.getElementById('modal-video');

    if (modal) {
        modal.style.display = 'none';
    }

    if (modalVideo) {
        modalVideo.pause();
    }
}


/* ==============================
   RESUMEN DE CHECKOUT
================================= */

function displayCartSummary() {
    cartItems = loadCart();
    cartTotal = calculateCartTotal(cartItems);

    updateCartCount();
    updateCartDisplay();
    updateTotals();
}


/* ==============================
   ENVÍO DEL FORMULARIO
================================= */

const checkoutForm = document.getElementById('checkoutForm');

if (checkoutForm) {
    checkoutForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        const storedCartItems = loadCart();
        const subtotal = calculateCartTotal(storedCartItems);
        const discountedTotal =
            subtotal * (1 - DISCOUNT_RATE);

        let cartDetails = '';

        for (
            const [productId, details]
            of Object.entries(storedCartItems)
        ) {
            const productName =
                getProductName(productId);

            const itemTotal =
                Number(details.price) *
                Number(details.quantity);

            cartDetails +=
                `${productName}: ${details.quantity} ` +
                `unidad${details.quantity > 1 ? 'es' : ''} ` +
                `- $${formatAmount(itemTotal)}\n`;
        }

        cartDetails +=
            `\nSubtotal: $${formatAmount(subtotal)}` +
            `\nDescuento por transferencia: 10%` +
            `\nTotal con descuento: $${formatAmount(discountedTotal)}`;

        const dataToSend = {
            name: formData.get('name'),
            surname: formData.get('surname'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            postal: formData.get('postal'),
            shipping: formData.get('shipping'),
            cart: cartDetails,
            subtotal: formatAmount(subtotal),
            discount: '10%',
            total: formatAmount(discountedTotal)
        };

        fetch('https://formspree.io/f/xkgwllgb', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        })
            .then(response => {
                if (response.ok) {
                    alert('Pedido enviado con éxito');

                    window.location.href = 'gracias.html';
                } else {
                    alert(
                        'Error al enviar el pedido. Intentá nuevamente.'
                    );
                }
            })
            .catch(error => {
                console.error('Error:', error);

                alert(
                    'Ocurrió un error al enviar el pedido. Por favor, intentá más tarde.'
                );
            });
    });
}


/* ==============================
   CARGAR CARRITO AL ABRIR PÁGINA
================================= */

document.addEventListener('DOMContentLoaded', function () {
    displayCartSummary();
});
