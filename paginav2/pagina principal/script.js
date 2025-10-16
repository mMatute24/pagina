// ===========================================
// LÓGICA DEL CARRUSEL (SLIDER) 
// ===========================================
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function showSlide(index) {
    if (slides.length === 0) return; 

    if (index >= totalSlides) currentSlide = 0;
    if (index < 0) currentSlide = totalSlides - 1;

    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    slides[currentSlide].classList.add('active');
}

function moveSlide(direction) {
    currentSlide += direction;
    showSlide(currentSlide);
}

function autoplay() {
    moveSlide(1);
}

// Inicialización del carrusel solo si estamos en index.html
if (document.getElementById('slider')) {
    showSlide(currentSlide);
    let autoplayInterval = setInterval(autoplay, 3000);

    document.querySelector('.slider-container').addEventListener('mouseover', () => {
        clearInterval(autoplayInterval);
    });
    document.querySelector('.slider-container').addEventListener('mouseout', () => {
        autoplayInterval = setInterval(autoplay, 3000);
    });
}


// ===========================================
// LÓGICA DE INFORMES Y NOTICIAS
// ===========================================

const FORM_INFORME = document.getElementById('form-informe');
const LISTA_INFORMES = document.getElementById('lista-informes');

// DETECCIÓN INFALIBLE: Solo si el formulario de creación existe, estamos en informes.html
const ES_PAGINA_ADMIN = !!FORM_INFORME;


/**
 * Carga los informes guardados y los renderiza.
 */
function cargarInformes() {
    if (!LISTA_INFORMES) return;

    const informes = JSON.parse(localStorage.getItem('informes')) || [];
    LISTA_INFORMES.innerHTML = ''; 

    if (informes.length === 0) {
        LISTA_INFORMES.innerHTML = '<p id="mensaje-vacio">No hay informes publicados aún.</p>';
        return;
    }

    informes.forEach(informe => {
        const informeDiv = document.createElement('article');
        informeDiv.classList.add('informe');
        informeDiv.dataset.id = informe.id; 

        const fechaPublicacion = new Date(informe.timestamp).toLocaleString('es-AR', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

        let htmlContent = `
            <h3>${informe.titulo}</h3>
            <p class="fecha-publicacion">Publicado el: ${fechaPublicacion}</p>
            <p>${informe.contenido.replace(/\n/g, '<br>')}</p>
        `;

        // Agrega el botón "Eliminar" solo si estamos en informes.html
        if (ES_PAGINA_ADMIN) {
             htmlContent += `<button class="btn-eliminar" data-id="${informe.id}">Eliminar</button>`;
        }

        informeDiv.innerHTML = htmlContent;
        LISTA_INFORMES.appendChild(informeDiv);
    });
}

function guardarNuevoInforme(titulo, contenido) {
    const informes = JSON.parse(localStorage.getItem('informes')) || [];
    
    const nuevoInforme = {
        id: Date.now(), 
        titulo: titulo,
        contenido: contenido,
        timestamp: new Date().toISOString() 
    };

    informes.unshift(nuevoInforme); 
    localStorage.setItem('informes', JSON.stringify(informes));
    cargarInformes(); 
}

function eliminarInforme(id) {
    let informes = JSON.parse(localStorage.getItem('informes')) || [];
    if (!confirm('¿Estás seguro de que quieres eliminar este informe?')) return;
    
    informes = informes.filter(informe => informe.id !== id);
    localStorage.setItem('informes', JSON.stringify(informes));
    cargarInformes(); 
}


// ===========================================
// LISTENERS (Eventos)
// ===========================================

// 1. Evento para crear un informe (solo si el formulario existe, en informes.html)
if (FORM_INFORME) {
    FORM_INFORME.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const titulo = document.getElementById('titulo').value;
        const contenido = document.getElementById('contenido').value;

        guardarNuevoInforme(titulo, contenido);

        // Limpiar formulario
        FORM_INFORME.reset();
    });
}

// 2. Evento para eliminar un informe (SOLO si estamos en informes.html)
if (LISTA_INFORMES && ES_PAGINA_ADMIN) {
    LISTA_INFORMES.addEventListener('click', function(event) {
        if (event.target.classList.contains('btn-eliminar')) {
            const idAEliminar = parseInt(event.target.dataset.id); 
            eliminarInforme(idAEliminar); 
        }
    });
}

// Cargar informes al cargar CUALQUIER página que tenga el contenedor #lista-informes
window.addEventListener('load', cargarInformes);