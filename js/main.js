// ===== CARRUSEL DE IMÁGENES =====
let currentSlideIndex = 0;
let carouselInterval;

function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    // Ajustar índice si está fuera de rango
    if (index >= slides.length) {
        currentSlideIndex = 0;
    } else if (index < 0) {
        currentSlideIndex = slides.length - 1;
    } else {
        currentSlideIndex = index;
    }
    
    // Ocultar todas las slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Desactivar todos los indicadores
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    // Mostrar slide actual
    slides[currentSlideIndex].classList.add('active');
    indicators[currentSlideIndex].classList.add('active');
}

function carouselNav(direction) {
    showSlide(currentSlideIndex + direction);
    resetCarouselTimer();
}

function currentSlide(index) {
    showSlide(index);
    resetCarouselTimer();
}

function autoSlide() {
    showSlide(currentSlideIndex + 1);
}

function startCarousel() {
    carouselInterval = setInterval(autoSlide, 10000); // Cambiar cada 10 segundos
}

function resetCarouselTimer() {
    clearInterval(carouselInterval);
    startCarousel();
}

// Smooth Scroll para enlaces
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Altura del navbar
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Animación de números en estadísticas
function animarNumeros() {
    const stats = document.querySelectorAll('.text-5xl');
    
    stats.forEach(stat => {
        const originalText = stat.textContent;
        const numbersOnly = originalText.replace(/[^0-9]/g, '');
        const target = parseInt(numbersOnly);
        
        if (isNaN(target)) return;
        
        const suffix = originalText.replace(numbersOnly, '');
        let current = 0;
        const increment = target / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target + suffix;
                clearInterval(timer);
            } else {
                stat.textContent = Math.ceil(current) + suffix;
            }
        }, 30);
    });
}

// Observador de intersección para animar cuando sea visible
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animarNumeros();
            observer.unobserve(entry.target);
        }
    });
});

const statsSection = document.querySelector('.bg-\\[\\#4d4341\\]');
if (statsSection) {
    observer.observe(statsSection);
}

// Función para mostrar error en un campo
function mostrarError(campoId, mensaje) {
    const campo = document.getElementById(campoId);
    const errorElemento = document.getElementById(`error-${campoId}`);
    
    campo.classList.remove('border-gray-300');
    campo.classList.add('border-red-500', 'border-2');
    errorElemento.textContent = mensaje;
    errorElemento.classList.remove('hidden');
}

// Función para limpiar errores
function limpiarError(campoId) {
    const campo = document.getElementById(campoId);
    const errorElemento = document.getElementById(`error-${campoId}`);
    
    campo.classList.remove('border-red-500', 'border-2');
    campo.classList.add('border-gray-300');
    errorElemento.classList.add('hidden');
}

// Función para limpiar todos los errores
function limpiarTodosLosErrores() {
    ['nombre', 'email', 'telefono', 'asunto', 'mensaje'].forEach(campo => {
        limpiarError(campo);
    });
}

// Función para enviar mensaje por WhatsApp
function enviarWhatsApp() {
    // Limpiar errores previos
    limpiarTodosLosErrores();
    
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const asunto = document.getElementById('asunto').value;
    const mensaje = document.getElementById('mensaje').value.trim();
    
    let hayError = false;
    
    // Validar nombre
    if (!nombre) {
        mostrarError('nombre', 'Por favor, ingresa tu nombre completo');
        hayError = true;
    } else if (nombre.length < 3) {
        mostrarError('nombre', 'El nombre debe tener al menos 3 caracteres');
        hayError = true;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        mostrarError('email', 'Por favor, ingresa tu correo electrónico');
        hayError = true;
    } else if (!emailRegex.test(email)) {
        mostrarError('email', 'Formato inválido. Ejemplo: nombre@gmail.com');
        hayError = true;
    }
    
    // Validar teléfono
    if (!telefono) {
        mostrarError('telefono', 'Por favor, ingresa tu número de teléfono');
        hayError = true;
    } else if (telefono.length < 7) {
        mostrarError('telefono', 'El teléfono debe tener al menos 7 dígitos');
        hayError = true;
    }
    
    // Validar asunto
    if (!asunto) {
        mostrarError('asunto', 'Por favor, selecciona un asunto');
        hayError = true;
    }
    
    // Validar mensaje (opcional, pero si tiene contenido debe tener al menos 10 caracteres)
    if (mensaje && mensaje.length < 10) {
        mostrarError('mensaje', 'El mensaje debe tener al menos 10 caracteres');
        hayError = true;
    }
    
    // Si hay errores, no continuar
    if (hayError) {
        return;
    }
    
    // Crear mensaje para WhatsApp con mejor formato
    let textoMensaje = `Hola, soy ${nombre} y me comunico desde la página web de Innova Food G.C.

Asunto: ${asunto}`;

    // Agregar mensaje solo si existe
    if (mensaje) {
        textoMensaje += `

Mi consulta:
${mensaje}`;
    }
    
    textoMensaje += `

Espero su respuesta. Gracias!`;
    
    // Codificar el mensaje
    const mensajeWhatsApp = encodeURIComponent(textoMensaje);
    
    // Número de WhatsApp
    const numeroWhatsApp = '593998426977';
    
    // Crear URL de WhatsApp
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeWhatsApp}`;
    
    // Abrir WhatsApp
    window.open(urlWhatsApp, '_blank');
    
    // Limpiar campos
    document.getElementById('nombre').value = '';
    document.getElementById('email').value = '';
    document.getElementById('telefono').value = '';
    document.getElementById('asunto').value = '';
    document.getElementById('mensaje').value = '';
}

// Limpiar errores cuando el usuario empiece a escribir
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Cerrar menú móvil al hacer clic en un enlace
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Iniciar carrusel automático
    setTimeout(() => {
        startCarousel();
    }, 500);

    // Pausar carrusel al pasar el mouse
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(carouselInterval);
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            startCarousel();
        });
    }

    // Limpiar errores en campos del formulario
    ['nombre', 'email', 'telefono', 'asunto', 'mensaje'].forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.addEventListener('input', function() {
                limpiarError(campoId);
            });
        }
    });
});
