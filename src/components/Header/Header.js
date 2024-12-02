import { Link, useLocation, useNavigate } from "react-router-dom";
import './Header.css';
import React, { useState, useRef, useEffect } from "react";
import { Icon } from '@iconify/react';
import Text from "../Text";
import Cookies from 'js-cookie';

const Header = () => {

    const [nomeUsuario, setNomeUsuario] = useState('');
    // const userRole = Cookies.get('nivelAcesso');
    // const id = Cookies.get('userId');
    // const usuario = { id: id };

    const menuRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();

    const [contextHeaderMenu, setContextHeaderMenu] = useState(false);

    const handleGoBack = () => {
        navigate(-1);
    };

    const toggleMenu = (e) => {
        e.stopPropagation();
        setContextHeaderMenu(!contextHeaderMenu);
    };

    useEffect(() => {
        const storedUserName = Cookies.get('nomeUsuario');
        if (storedUserName) {
            setNomeUsuario(storedUserName);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleClickOutside = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target) && e.target.id !== "icon-menu") {
            setContextHeaderMenu(false);
        }
    };
    

    return (
        <div className='header-container'>

            <div className="header-inicio">
                <div className="container-menu" title="Abrir menu" onClick={(e) => toggleMenu(e)}>
                    <Icon icon="dashicons:menu-alt3" id="icon-menu" />
                </div>

                <div className="container-voltar" onClick={handleGoBack} title="Voltar">
                    <Icon icon="icon-park-solid:back" id="icon-voltar" />
                </div>

                <div className="container-home">
                    <Link to="/inicio" title="Tela inicial">
                        <Icon icon="iconamoon:home-fill" id="icon-home" />
                    </Link>
                </div>
            </div>

            <div className="header-final">
                <div className="header-conta" title="Configurações da conta">
                    <Text
                        text={nomeUsuario}
                        color={'rgb(231 227 227)'}
                        fontSize={'15px'}
                    />
                    <Link to="/minha-conta">
                        <Icon icon="mdi:account-box" id="icon-conta" />
                    </Link>
                </div>

                {/* <div id="container-logo-header">
                    <img src={logo} id="logo-header" alt="Logo da empresa" />
                </div> */}
            </div>


            {contextHeaderMenu && (
                <div className="container-header-menu" ref={menuRef}>
                    <div id="header-menu-itens" onClick={() => navigate('/inicio')}>
                        <Text text={'Inicio'}  />
                    </div>
                    <div id="header-menu-itens" onClick={() => navigate('/cadastrar-usuario')}>
                        <Text text={'Cadastrar usuário'}  />
                    </div>
                    <div id="header-menu-itens" onClick={() => navigate('/cadastrar-tipo-veiculo')}>
                        <Text text={'Cadastrar tipo veículo'}  />
                    </div>
                    <div id="header-menu-itens" onClick={() => navigate('/cadastrar-cidade')}>
                        <Text text={'Cadastrar cidade'}  />
                    </div>
                </div>
            )}

        </div >
    );
};

export default Header;  