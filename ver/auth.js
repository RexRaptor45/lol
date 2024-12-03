// auth.js

// Selección de elementos
const loginScreen = document.getElementById('loginScreen');
const registerScreen = document.getElementById('registerScreen');
const menu = document.getElementById('menu');
const playAsGuestButton = document.getElementById('playAsGuest');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Lógica para entrar como visitante
playAsGuestButton.addEventListener('click', () => {
    console.log('Entrando como visitante...');
    loginScreen.style.display = 'none';
    menu.style.display = 'block';
    alert('Estás jugando como visitante. Los puntajes no se guardarán.');
});

// Inicio de sesión
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            loginScreen.style.display = 'none';
            menu.style.display = 'block';
        } else {
            alert('Usuario o contraseña incorrectos.');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Hubo un problema al conectar con el servidor.');
    }
});

// Registro de usuario
registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch('http://localhost:5000/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            alert('Registro exitoso. Ahora inicia sesión.');
            registerScreen.style.display = 'none';
            loginScreen.style.display = 'block';
        } else {
            alert('Error al registrar usuario.');
        }
    } catch (error) {
        console.error('Error al registrarse:', error);
        alert('Hubo un problema al conectar con el servidor.');
    }
});

// Cambiar a registro
document.getElementById('showRegister').addEventListener('click', () => {
    loginScreen.style.display = 'none';
    registerScreen.style.display = 'block';
});

// Cambiar a inicio de sesión
document.getElementById('showLogin').addEventListener('click', () => {
    registerScreen.style.display = 'none';
    loginScreen.style.display = 'block';
});
