/* ==========================================
   MODIFICACIÓN 6
   ELEMENTOS PRINCIPALES
========================================== */

const pantallaInicial = document.getElementById("pantallaInicial");
const btnAbrir = document.getElementById("btnAbrir");

const musica = document.getElementById("musicaFondo");

const btnMusica = document.getElementById("btnMusica");
const iconoMusica = document.getElementById("iconoMusica");

const barraProgreso = document.getElementById("barraProgreso");
const tiempoActual = document.getElementById("tiempoActual");
const duracionTotal = document.getElementById("duracionTotal");

const volumenMusica = document.getElementById("volumenMusica");
const mensajeMusica = document.getElementById("mensajeMusica");

let invitacionAbierta = false;


/* ==========================================
   CONFIGURACIÓN DE AUDIO
========================================== */

// Volumen normal al 100%.
musica.volume = 1;

// Mostrar el volumen inicial.
volumenMusica.value = 1;


/* ==========================================
   INTENTO DE REPRODUCCIÓN AUTOMÁTICA
========================================== */

// Algunos navegadores permiten reproducir música
// al cargar la página. Otros necesitan interacción.

window.addEventListener("load", function () {

    musica.play().then(function () {

        actualizarBotonMusica();

        mensajeMusica.textContent = "Reproduciendo nuestra canción";

    }).catch(function () {

        mensajeMusica.textContent =
            "Toca el sobre para comenzar la música";

        actualizarBotonMusica();

    });

});


/* ==========================================
   ABRIR SOBRE Y MOSTRAR INVITACIÓN
========================================== */

btnAbrir.addEventListener("click", async function () {

    if (invitacionAbierta) return;

    invitacionAbierta = true;

    // Animación de apertura.
    pantallaInicial.classList.add("abriendo");

    // Si el navegador bloqueó el audio al cargar,
    // este toque del usuario permite intentarlo de nuevo.
    if (musica.paused) {

        try {

            await musica.play();

            mensajeMusica.textContent =
                "Reproduciendo nuestra canción";

        } catch (error) {

            mensajeMusica.textContent =
                "Presiona reproducir para escuchar la canción";

        }

    }

    actualizarBotonMusica();

    // Cerrar la portada después de la animación.
    setTimeout(function () {

        pantallaInicial.classList.add("oculta");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }, 1100);

});


/* ==========================================
   BOTÓN REPRODUCIR / PAUSAR
========================================== */

btnMusica.addEventListener("click", async function () {

    if (musica.paused) {

        try {

            await musica.play();

            mensajeMusica.textContent =
                "Reproduciendo nuestra canción";

        } catch (error) {

            mensajeMusica.textContent =
                "No se pudo reproducir el audio";

        }

    } else {

        musica.pause();

        mensajeMusica.textContent =
            "Canción en pausa";

    }

    actualizarBotonMusica();

});


/* ==========================================
   ACTUALIZAR ICONO DEL REPRODUCTOR
========================================== */

function actualizarBotonMusica() {

    if (musica.paused) {

        iconoMusica.textContent = "▶";

        btnMusica.setAttribute(
            "aria-label",
            "Reproducir música"
        );

    } else {

        iconoMusica.textContent = "Ⅱ";

        btnMusica.setAttribute(
            "aria-label",
            "Pausar música"
        );

    }

}

musica.addEventListener("play", actualizarBotonMusica);
musica.addEventListener("pause", actualizarBotonMusica);


/* ==========================================
   FORMATO DE TIEMPO
========================================== */

function formatoTiempo(segundos) {

    if (!Number.isFinite(segundos)) {
        return "0:00";
    }

    const minutos = Math.floor(segundos / 60);

    const segundosRestantes = Math.floor(segundos % 60);

    return minutos + ":" +
        String(segundosRestantes).padStart(2, "0");

}


/* ==========================================
   CARGAR DURACIÓN DE LA CANCIÓN
========================================== */

musica.addEventListener("loadedmetadata", function () {

    duracionTotal.textContent =
        formatoTiempo(musica.duration);

});


/* ==========================================
   ACTUALIZAR BARRA DE PROGRESO
========================================== */

musica.addEventListener("timeupdate", function () {

    if (!Number.isFinite(musica.duration) || musica.duration <= 0) {
        return;
    }

    const progreso =
        (musica.currentTime / musica.duration) * 100;

    barraProgreso.value = progreso;

    tiempoActual.textContent =
        formatoTiempo(musica.currentTime);

    duracionTotal.textContent =
        formatoTiempo(musica.duration);

});


/* ==========================================
   MOVERSE DENTRO DE LA CANCIÓN
========================================== */

barraProgreso.addEventListener("input", function () {

    if (
        Number.isFinite(musica.duration) &&
        musica.duration > 0
    ) {

        const nuevoTiempo =
            (barraProgreso.value / 100) * musica.duration;

        musica.currentTime = nuevoTiempo;

    }

});


/* ==========================================
   CONTROL DE VOLUMEN
========================================== */

volumenMusica.addEventListener("input", function () {

    musica.volume = Number(volumenMusica.value);

});


/* ==========================================
   CUENTA REGRESIVA
========================================== */

// 16 de enero de 2027 a las 5:00 PM.
// Zona horaria de Morelos, México: UTC-6.

const fechaEvento = new Date(
    "2027-01-16T17:00:00-06:00"
).getTime();


function actualizarContador() {

    const diasElemento = document.getElementById("dias");
    const horasElemento = document.getElementById("horas");
    const minutosElemento = document.getElementById("minutos");
    const segundosElemento = document.getElementById("segundos");

    if (!diasElemento) return;

    const ahora = Date.now();

    const diferencia = fechaEvento - ahora;

    if (diferencia <= 0) {

        diasElemento.textContent = "00";
        horasElemento.textContent = "00";
        minutosElemento.textContent = "00";
        segundosElemento.textContent = "00";

        return;

    }

    const dias = Math.floor(
        diferencia / (1000 * 60 * 60 * 24)
    );

    const horas = Math.floor(
        (diferencia / (1000 * 60 * 60)) % 24
    );

    const minutos = Math.floor(
        (diferencia / (1000 * 60)) % 60
    );

    const segundos = Math.floor(
        (diferencia / 1000) % 60
    );

    diasElemento.textContent =
        String(dias).padStart(2, "0");

    horasElemento.textContent =
        String(horas).padStart(2, "0");

    minutosElemento.textContent =
        String(minutos).padStart(2, "0");

    segundosElemento.textContent =
        String(segundos).padStart(2, "0");

}


actualizarContador();

setInterval(actualizarContador, 1000);


/* ==========================================
   ANIMACIONES AL DESPLAZARSE
========================================== */

const secciones = document.querySelectorAll(".seccion");

secciones.forEach(function (seccion) {

    seccion.classList.add("animar-entrada");

});


const observador = new IntersectionObserver(

    function (entradas) {

        entradas.forEach(function (entrada) {

            if (entrada.isIntersecting) {

                entrada.target.classList.add("visible");

                observador.unobserve(entrada.target);

            }

        });

    },

    {
        threshold: 0.12
    }

);


secciones.forEach(function (seccion) {

    observador.observe(seccion);

});