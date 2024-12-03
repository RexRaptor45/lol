// js/api.js

const API_URL = 'http://localhost:5000'; // Cambia según el entorno

async function postRequest(endpoint, body) {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    return await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
    });
}

async function getRequest(endpoint) {
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    return await fetch(`${API_URL}${endpoint}`, { headers });
}

export { postRequest, getRequest };
