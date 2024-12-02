import axios from 'axios';
import Cookies from 'js-cookie';

// Configuração da URL base da API
const api = axios.create({
      baseURL: 'http://localhost:8080/api',
});

// Intercepta requisições para incluir o token JWT
api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// Interceptor para tratamento de erros
// api.interceptors.response.use(
//     response => response,
//     error => {
//         if (error.response && error.response.status === 401) {
//             const errorMessage = encodeURIComponent(error.response.data?.message || "Sua sessão expirou");
//             window.location.href = `/login?error=${errorMessage}`;
//             Cookies.remove('token');
//             Cookies.remove('nomeUsuario');
//             Cookies.remove('userId');
//             Cookies.remove('nivelAcesso');
//         }
//         return Promise.reject(error);
//     }
// );


// Interceptor para verificar roles
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 403) {
            const errorMessage = encodeURIComponent("Acesso negado.");
            window.location.href = `/access-denied?error=${errorMessage}`;
            Cookies.remove('token');
            Cookies.remove('nomeUsuario');
            Cookies.remove('userId');
            Cookies.remove('nivelAcesso');
        }
        return Promise.reject(error);
    }
);


export default api;