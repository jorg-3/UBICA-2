document.addEventListener('DOMContentLoaded', () => {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    console.log('Página cargada:', page);

    if (page === 'index.html') {
        initIndex();
    } else if (page === 'iniciar-sesion.html') {
        initIniciarSesion();
    } else if (page === 'rutas-tiempo-real.html') {
        initRutasTiempoReal();
    } else if (page === 'emociones.html') {
        initEmociones();
    } else if (page === 'foro.html') {
        initForo();
    } else if (page === 'desafio.html') {
        initDesafio();
    }

    initNavbar();
});

window.addEventListener('load', () => {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    console.log('Ventana cargada:', page);

    if (page !== 'emociones.html') {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.style.display = 'none', 1000);
            }, 1000);
        }
    }
});

function initIndex() {
    const usuarioRegistrado = getCookie('navegacionEmocionalActiva') === 'true';
    const btnEmocional = document.getElementById('btn-navegacion-emocional');
    const btnDesafios = document.getElementById('btn-desafios-diarios');
    const btnForo = document.getElementById('btn-foro');

    if (usuarioRegistrado) {
        btnEmocional.disabled = btnDesafios.disabled = btnForo.disabled = false;
        btnEmocional.style.cursor = btnDesafios.style.cursor = btnForo.style.cursor = 'pointer';
        document.querySelectorAll('.help-button').forEach(btn => {
            btn.style.display = 'none';
        });
        btnEmocional.addEventListener('click', () => {
            window.location.href = 'emociones.html';
        });
        btnDesafios.addEventListener('click', () => {
            window.location.href = 'desafio.html';
        });
        btnForo.addEventListener('click', () => {
            window.location.href = 'foro.html';
        });
    } else {
        btnEmocional.disabled = btnDesafios.disabled = btnForo.disabled = true;
        btnEmocional.style.opacity = btnDesafios.style.opacity = btnForo.style.opacity = '1';
        btnEmocional.style.cursor = btnDesafios.style.cursor = btnForo.style.cursor = 'not-allowed';
        btnEmocional.title = btnDesafios.title = btnForo.title = 'Debes estar registrado para acceder a esta funcionalidad';
        document.querySelectorAll('.help-button').forEach(btn => {
            btn.style.display = 'inline-block';
            btn.addEventListener('click', () => {
                alert('Debes iniciar sesión o registrarte para acceder a esta funcionalidad');
        });
    });
    }
}

function initIniciarSesion() {
    const loginForm = document.querySelector('#login-form');
    const loginTitle = document.querySelector('#login-title');
    const registerLink = document.querySelector('#register-link');
    const messageContainer = document.querySelector('#access-message');
    const params = new URLSearchParams(window.location.search);

    console.log('Inicializando iniciar-sesion.html', { loginForm, loginTitle, registerLink, params: params.toString() });

    if (params.get('nuevo') === '1') {
        if (loginTitle) loginTitle.textContent = 'Nuevo usuario';
        if (registerLink) registerLink.remove();
    }

    if (params.get('from') === 'foro' && messageContainer) {
        messageContainer.textContent = 'Regístrate o inicia sesión para poder disfrutar de esta funcionalidad';
        messageContainer.style.display = 'block';
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            if (username.trim() === '') {
                alert('Por favor, ingresa un nombre válido.');
                return;
            }
            setCookie('navegacionEmocionalActiva', 'true', 7);
            setCookie('userName', username, 7);
            console.log('Sesión iniciada:', { username });
            window.location.href = params.get('from') === 'foro' ? 'foro.html' : 'index.html';
        });
    }
}

function initRutasTiempoReal() {
    let modoCamaraActivo = false;
    let streamActivo = null;

    const boton = document.getElementById("botonCamara");
    const imagen = document.getElementById("imagen-resultante");
    const video = document.getElementById("vista-previa");
    const inputImportar = document.getElementById("importarImagen");
    const botonImportar = document.getElementById("botonImportar");

    boton.addEventListener("click", async () => {
        if (!modoCamaraActivo) {
            botonImportar.disabled = true;

            try {
                streamActivo = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = streamActivo;
                video.style.display = "block";
                imagen.style.display = "none";
                boton.textContent = "Hacer foto";
                modoCamaraActivo = true;
            } catch (error) {
                alert("No se pudo acceder a la cámara.");
                botonImportar.disabled = false;
            }
        } else {
            if (streamActivo) streamActivo.getTracks().forEach(track => track.stop());
            video.style.display = "none";
            boton.disabled = true;
            boton.textContent = "Procesando...";

            setTimeout(() => {
                const aleatorio = Math.random() < 0.5 ? "Lis-info.png" : "Romano-info.png";
                imagen.src = `../images/${aleatorio}`;
                imagen.style.display = "block";
                boton.textContent = "Hacer foto";
                boton.disabled = false;
                botonImportar.disabled = false;
                modoCamaraActivo = false;
            }, 3000);
        }
    });

    botonImportar.addEventListener("click", () => {
        boton.disabled = true;
        inputImportar.click();
    });

    inputImportar.addEventListener("change", () => {
        const file = inputImportar.files[0];
        if (file && file.type.startsWith("image/")) {
            botonImportar.disabled = true;
            botonImportar.textContent = "Procesando...";
            video.style.display = "none";
            imagen.style.display = "none";

            setTimeout(() => {
                const aleatorio = Math.random() < 0.5 ? "Lis-info.png" : "Romano-info.png";
                imagen.src = `../images/${aleatorio}`;
                imagen.style.display = "block";
                botonImportar.textContent = "Importar imagen";
                botonImportar.disabled = false;
                boton.disabled = false;
                modoCamaraActivo = false;
            }, 3000);
        } else {
            boton.disabled = false;
        }
    });

    imagen.addEventListener("click", (event) => {
        if (!imagen.src || imagen.style.display === "none") return;

        const zonaAncho = imagen.clientWidth;
        const isLeft = event.offsetX < zonaAncho / 2;

        const cambiarImagen = (nuevaSrc) => {
            imagen.style.opacity = 0;
            setTimeout(() => {
                imagen.src = nuevaSrc;
                imagen.style.opacity = 1;
            }, 200);
        };

        const srcActual = imagen.src;

        if (srcActual.includes("Lis-info.png")) {
            cambiarImagen(isLeft ? "../images/Lis-catedral.png" : "../images/Lis-lis.png");
        } else if (srcActual.includes("Romano-info.png")) {
            cambiarImagen(isLeft ? "../images/Romano-catedral.png" : "../images/Romano-romano.png");
        } else {
            cambiarImagen(srcActual.includes("Lis") ? "../images/Lis-info.png" : "../images/Romano-info.png");
        }
    });
}

function initEmociones() {
    const usuarioRegistrado = getCookie('navegacionEmocionalActiva') === 'true';
    console.log('Verificando emociones:', { usuarioRegistrado });
    if (!usuarioRegistrado) {
        window.location.href = 'iniciar-sesion.html';
        return;
    }

    const overlay = document.getElementById('loading-overlay');
    const message = document.getElementById('loading-message');

    const emociones = [
        { nombre: "Relajado", ruta: "Parque natural cercano", motivo: "Necesitas un respiro, desconéctate en la naturaleza." },
        { nombre: "Eufórico", ruta: "Zona de bares y eventos", motivo: "Tu energía está a tope, es momento de fiesta y socializar." },
        { nombre: "Reflexivo", ruta: "Museo o biblioteca", motivo: "Parece que buscas inspiración, un lugar de conocimiento te vendría bien." },
        { nombre: "Romántico", ruta: "Mirador o playa", motivo: "Tu corazón necesita emociones, aquí encontrarás el ambiente perfecto." },
        { nombre: "Aventurero", ruta: "Ruta de senderismo o deporte extremo", motivo: "Tu espíritu busca adrenalina, esta ruta es ideal para ti." },
        { nombre: "Hambriento", ruta: "Restaurante bien valorado", motivo: "Tu cuerpo necesita combustible, aquí disfrutarás de una gran comida." }
    ];

    const coloresPorEmocion = {
        "Relajado": "#d0e8d0",
        "Eufórico": "#fff3b0",
        "Reflexivo": "#d7d3f0",
        "Romántico": "#ffd6d6",
        "Aventurero": "#d0e5f9",
        "Hambriento": "#fce5cd"
    };

    const frases = [
        "Cuidar tu salud mental es importante",
        "La naturaleza también te cuida si la escuchas",
        "Caminar también es una forma de meditar",
        "Conectar contigo es el primer paso",
        "El ritmo lento también es avance",
        "Respira, siente, camina"
    ];

    const mostrarMensaje = (texto) => {
        message.style.opacity = 0;
        setTimeout(() => {
            message.textContent = texto;
            message.style.display = 'block';
            message.style.opacity = 1;
        }, 800);
    };

    message.textContent = "Mantén el contacto con el dispositivo";
    message.style.display = "block";
    message.style.opacity = 1;

    setTimeout(() => {
        mostrarMensaje("Analizando emociones...");
    }, 5000);

    setTimeout(() => {
        let frasesRestantes = [...frases];
        const duracionTotal = Math.floor(Math.random() * 6 + 5) * 1000;
        const fin = Date.now() + duracionTotal;

        const mostrarFrase = () => {
            if (Date.now() >= fin) {
                message.style.opacity = 0;
                overlay.style.opacity = 0;
                setTimeout(() => {
                    overlay.style.display = 'none';
                    mostrarResultado();
                }, 1000);
                return;
            }

            if (frasesRestantes.length === 0) {
                frasesRestantes = [...frases];
            }

            const index = Math.floor(Math.random() * frasesRestantes.length);
            const frase = frasesRestantes.splice(index, 1)[0];
            mostrarMensaje(frase);

            setTimeout(mostrarFrase, 3000);
        };

        mostrarFrase();
    }, 8000);

    const mostrarResultado = () => {
        const emocionElegida = emociones[Math.floor(Math.random() * emociones.length)];
        const colorFondo = coloresPorEmocion[emocionElegida.nombre] || "#ffffff";

        document.body.style.transition = "background-color 1.5s ease";
        document.body.style.backgroundColor = colorFondo;

        const resultado = document.createElement('div');
        resultado.classList.add('resultado-emocion');
        resultado.innerHTML = `
            <h1>${emocionElegida.nombre}</h1>
            <h3>${emocionElegida.ruta}</h3>
            <p>${emocionElegida.motivo}</p>
        `;
        document.body.appendChild(resultado);
    };
}

function initForo() {
    const usuarioRegistrado = getCookie('navegacionEmocionalActiva') === 'true';
    console.log('Verificando foro:', { usuarioRegistrado, cookie: getCookie('navegacionEmocionalActiva') });
    if (!usuarioRegistrado) {
        window.location.href = 'iniciar-sesion.html?from=foro';
        return;
    }
}

function initDesafio() {
    const usuarioRegistrado = getCookie('navegacionEmocionalActiva') === 'true';
    console.log('Verificando desafio:', { usuarioRegistrado });
    if (!usuarioRegistrado) {
        window.location.href = 'iniciar-sesion.html';
        return;
    }
}

function initNavbar() {
    const navLoginBtn = document.getElementById('nav-login-btn');
    if (!navLoginBtn) {
        console.warn('Botón de login en navbar no encontrado');
        return;
    }

    const isLoggedIn = getCookie('navegacionEmocionalActiva') === 'true';
    const userName = getCookie('userName');

    console.log('Inicializando navbar:', { isLoggedIn, userName });

    if (isLoggedIn && userName) {
        // Crear contenedor para el menú desplegable
        const dropdownContainer = document.createElement('div');
        dropdownContainer.classList.add('dropdown-container');
        navLoginBtn.parentElement.appendChild(dropdownContainer);

        navLoginBtn.textContent = `Hola ${userName}`;
        navLoginBtn.href = '#';
        navLoginBtn.classList.add('user-greeting');

        // Crear menú desplegable
        const dropdownMenu = document.createElement('div');
        dropdownMenu.classList.add('dropdown-menu');
        dropdownMenu.innerHTML = `
            <a href="#" class="dropdown-item logout-btn">Cerrar Sesión</a>
        `;
        dropdownContainer.appendChild(dropdownMenu);

        // Mostrar/ocultar menú al hacer clic
        navLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            dropdownMenu.classList.toggle('show');
        });

        // Cerrar sesión al hacer clic en "Cerrar Sesión"
        const logoutBtn = dropdownMenu.querySelector('.logout-btn');
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            setCookie('navegacionEmocionalActiva', '', -1);
            setCookie('userName', '', -1);
            console.log('Sesión cerrada');
            dropdownMenu.classList.remove('show');
            navLoginBtn.textContent = 'Inicia Sesión';
            navLoginBtn.href = 'iniciar-sesion.html';
            navLoginBtn.classList.remove('user-greeting');
            dropdownContainer.remove();
            window.location.href = 'index.html';
        });

        // Ocultar menú si se hace clic fuera
        document.addEventListener('click', (e) => {
            if (!dropdownContainer.contains(e.target) && !navLoginBtn.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
    } else {
        navLoginBtn.textContent = 'Inicia Sesión';
        navLoginBtn.href = 'iniciar-sesion.html';
        navLoginBtn.classList.remove('user-greeting');
    }
    
    // Marcar enlace activo en navbar
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links li a').forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref && linkHref === currentPage) {
        link.classList.add('active');
    }
});

}

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 86400000);
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
    console.log(`Cookie establecida: ${name}=${value}`);
}

function getCookie(name) {
    const value = document.cookie.split('; ').find(row => row.startsWith(`${name}=`))?.split('=')[1];
    console.log(`Cookie leída: ${name}=${value}`);
    return value;
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}