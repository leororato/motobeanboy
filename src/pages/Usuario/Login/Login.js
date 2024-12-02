import "./Login.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';

// import Logo from "../../../../assets/logo.png"
import axios from "axios";
import ErrorNotification from "../../../components/ErrorNotification/ErrorNotification";
import SucessNotification from "../../../components/SucessNotification/SucessNotification";
import Text from "../../../components/Text";
import Input from "../../../components/Input";
import Button from "../../../components/Button";

function Login() {
    const navigate = useNavigate();
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");

    const location = useLocation();
    const query = new URLSearchParams(useLocation().search);
    const errorTokenMessage = query.get('error');
    const [errorMessage, setErrorMessage] = useState(location.state?.errorMessage || null);
    const [sucessMessage, setSucessMessage] = useState(null);

    useEffect(() => {
        if (errorTokenMessage != null) {
            setErrorMessage(errorTokenMessage);
        }
    }, [errorTokenMessage])



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Faz a requisição de login
            const response = await axios.post('http://localhost:8080/auth/login', {
                login: login,
                senha: senha
            });

            Cookies.set('token', response.data.token, {
                expires: 7,               // expira em 7 dias
                sameSite: 'Lax',        // impede o envio do cookie em solicitações de terceiros
            });

            Cookies.set('nomeUsuario', response.data.nome, {
                expires: 7,               // expira em 7 dias
                sameSite: 'Lax',        // impede o envio do cookie em solicitações de terceiros
            });

            Cookies.set('userId', response.data.id, {
                expires: 7,               // expira em 7 dias
                sameSite: 'Lax',        // impede o envio do cookie em solicitações de terceiros
            })

            Cookies.set('nivelAcesso', response.data.nivelAcesso, {
                expires: 7,               // expira em 7 dias
                sameSite: 'Lax',        // impede o envio do cookie em solicitações de terceiros
            })

            navigate('/inicio');
        } catch (error) {
            if (error.response) {

                const errorMessage = error.response?.data || "Erro desconhecido ao fazer Login";
                setErrorMessage(errorMessage);

            }
        }
    };

    return (
        <div className="body-login">
            <ErrorNotification message={errorMessage} onClose={() => { setErrorMessage(null) }} />
            <SucessNotification message={sucessMessage} onClose={() => { setSucessMessage(null) }} />
            <div className="login-aba">
                <form onSubmit={handleSubmit}>
                    <div className="login-bloco">

                        <div className="logo-container">
                            {/* <img src={Logo} width={'200px'} height={'80px'} /> */}
                        </div>
                        <div className="login-itens">
                            <div className="login-container">
                                <p>Login:</p>
                                <div>
                                    <input
                                        id="input-login"
                                        type={'text'}
                                        placeholder={'Digite seu Login'}
                                        padding={7}
                                        onChange={(e) => setLogin(e.target.value)}
                                        value={login}
                                    />
                                </div>
                            </div>

                            <div className="password-container">
                                <p>Senha:</p>
                                <input
                                    id="input-senha"
                                    type={'password'}
                                    placeholder={'Digite sua Senha'}
                                    padding={7}
                                    onChange={(e) => setSenha(e.target.value)}
                                    value={senha}
                                />
                            </div>

                        </div>
                        <Button
                            className="button-entrar"
                            text={'Entrar'}
                            onClick={handleSubmit}
                            type={"submit"}
                            padding={10}
                            borderRadius={3}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
