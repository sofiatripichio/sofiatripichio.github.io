// Seleccionar todos los videos
let videos = document.querySelectorAll('video');

// Crear el observador de intersección
let observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        // Verificar si el video está visible
        if (entry.isIntersecting) {
            // Reproducir el video si está visible
            entry.target.play();
        } else {
            // Pausar el video si deja de estar visible
            entry.target.pause();
        }
    });
}, { threshold: 0.5 });  // Reproduce cuando al menos el 50% del video está visible

// Observar cada video
videos.forEach(video => {
    observer.observe(video);
});

document.getElementById('icon-menu').addEventListener('click', function() {
    const checkbox = document.getElementById('bar');
    checkbox.checked = !checkbox.checked; // Cambia el estado del checkbox
});



