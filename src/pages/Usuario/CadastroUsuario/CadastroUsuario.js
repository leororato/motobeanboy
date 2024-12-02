import { useEffect, useState } from "react";
import './CadastroUsuario.css';
import ErrorNotification from "../../../components/ErrorNotification/ErrorNotification";
import Input from "../../../components/Input";
import SucessNotification from "../../../components/SucessNotification/SucessNotification";
import Text from "../../../components/Text";
import api from "../../../axiosConfig";
import Button from "../../../components/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import Loading from "../../../components/Loading/Loading";
import { format } from "date-fns";
import Header from "../../../components/Header/Header";

function CadastroUsuario() {
    const [errorMessage, setErrorMessage] = useState("");
    const [sucessMessage, setSucessMessage] = useState("");
    const [contextLoading, setContextLoading] = useState({ visible: false });
    const [estadoDaPagina, setEstadoDaPagina] = useState("Carregando");
    const [estadoDoCadastro, setEstadoDoCadastro] = useState("Cadastro")
    const [selectedItemId, setSelectedItemId] = useState(null);

    const [usuarios, setUsuarios] = useState([]);
    const [filteredUsuarios, setFilteredUsuarios] = useState([]);
    const [buscaLogin, setBuscaLogin] = useState('');
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, selectedId: null });
    const nivelAcessoLabels = {
        A: "Admin",
        G: "Geral",
        V: "Visualização",
        C: "Coleta", // Presumo que "C" seja para "Coleta"
    };

    // cadastro
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [formDataUsuario, setFormDataUsuario] = useState({
        nome: "",
        login: "",
        senha: "",
        nivelAcesso: ""
    });

    // ediçao
    const [formDataEdicaoUsuario, setFormDataEdicaoUsuario] = useState({
        id: null,
        nome: "",
        login: "",
        senha: null,
        nivelAcesso: "",
        ativo: ""
    });


    const buscarUsuarios = async () => {
        try {
            const response = await api.get("/usuario/buscar-todos-usuarios");
            setUsuarios(response.data);
        } catch (error) {
            const errorMessage = error.response?.data || "Erro desconhecido ao criar usuário";
            setErrorMessage(errorMessage);
        }
    }

    useEffect(() => {
        const filteredUsuarios = usuarios.filter(user =>
            (user.login ? user.login.toLowerCase() : '').includes(buscaLogin.toLowerCase())
        );
        setFilteredUsuarios(filteredUsuarios);
    }, [buscaLogin, usuarios]);

    useEffect(() => {
        buscarUsuarios();
    }, [])

    const handleChangeFormData = (e) => {
        const { name, value } = e.target;
        setFormDataUsuario({
            ...formDataUsuario,
            [name]: value
        })
    }

    const handleChangeFormDataEdicao = (e) => {
        const { name, value } = e.target;
        setFormDataEdicaoUsuario({
            ...formDataEdicaoUsuario,
            [name]: value
        })
    }

    const handleCancelarCadastroOuEdicao = () => {
        setFormDataUsuario({
            nome: "",
            login: "",
            senha: "",
            nivelAcesso: ""
        });
        setFormDataEdicaoUsuario({
            id: null,
            nome: "",
            login: "",
            senha: null,
            nivelAcesso: "",
            ativo: ""
        });
        setEstadoDoCadastro("Cadastro");
    }

    const handleRightClick = (e, id, nome, login, nivelAcesso, ativo) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            selectedId: id,
            selectedNome: nome,
            selectedLogin: login,
            selectedNivelAcesso: nivelAcesso,
            selectedAtivo: ativo,
        });
        setFormDataEdicaoUsuario({
            id: id,
            nome: nome,
            login: login,
            senha: "",
            nivelAcesso: nivelAcesso,
            ativo: ativo
        });

        setSelectedItemId(id);
    }

    const handleClickOutside = () => {
        setContextMenu({
            visible: false,
            x: 0,
            y: 0,
            selectedId: null,
            selectedSeq: null,
            selectedDesc: null
        });

        setSelectedItemId(null);
    };

    const handleToggleSenha = () => {
        if (mostrarSenha === true) {
            setMostrarSenha(false);
        } else {
            setMostrarSenha(true);
        }
    };

    const formatarData = (dtCriacao) => {
        if (!dtCriacao) return 'Data inválida';
        return format(new Date(dtCriacao), 'dd/MM/yyyy - HH:mm');
    };

    const handleAtualizarUsuario = () => {
        setEstadoDoCadastro("Editar");
    }

    const cadastrarUsuario = async () => {
        setEstadoDaPagina("Salvando");
        setContextLoading({ visible: true });

        try {
            await api.post('/usuario/cadastrar-usuario', formDataUsuario);
            setSucessMessage("Usuário criado com sucesso");

            setFormDataUsuario({
                nome: "",
                login: "",
                senha: "",
                nivelAcesso: ""
            })

            await buscarUsuarios();

        } catch (error) {
            const errorMessage = error.response?.data || "Erro desconhecido ao criar usuário";
            setErrorMessage(errorMessage);

            setFormDataUsuario({
                nome: "",
                login: "",
                senha: "",
                nivelAcesso: ""
            });

        } finally {
            setContextLoading({ visible: false });
            setMostrarSenha(false);

        }
    }


    const atualizarUsuario = async () => {
        setEstadoDaPagina("Atualizando");
        setContextLoading({ visible: true });

        try {
            await api.put(`/usuario/atualizar-usuario/${formDataEdicaoUsuario.id}`, formDataEdicaoUsuario);

            setSucessMessage("Usuário atualizado com sucesso");

            setEstadoDoCadastro("Cadastro");
            await setFormDataEdicaoUsuario({
                id: null,
                nome: "",
                login: "",
                senha: "",
                nivelAcesso: "",
                ativo: ""
            });

            await buscarUsuarios();

        } catch (error) {
            const errorMessage = error.response?.data || "Erro desconhecido ao atualizar usuário";
            setErrorMessage(errorMessage);

            setFormDataEdicaoUsuario({
                id: null,
                nome: "",
                login: "",
                senha: null,
                nivelAcesso: "",
                ativo: ""
            });
            setMostrarSenha(false);

        } finally {
            setContextLoading({ visible: false });
            setMostrarSenha(false);

        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <Header />
            <ErrorNotification message={errorMessage} onClose={() => { setErrorMessage(null) }} />
            <SucessNotification message={sucessMessage} onClose={() => { setSucessMessage(null) }} />

            <div className="container-cadastro-usuario">

                <div className="itens-cadastro-usuario">
                    <div id="titulo-cadastro-usuario">
                        <Text text={estadoDoCadastro === "Cadastro" ? "Cadastrar novo usuário" : "Editar usuário"} />
                    </div>
                    <form onSubmit={atualizarUsuario}>
                        <div className="container-form-cadastro-usuario">
                            <div id="box-item-input">
                                <label>Nome:</label>
                                {estadoDoCadastro === "Cadastro" ?
                                    <Input
                                        title={"Digite o nome do usuário"}
                                        placeholder={"Digite o nome do usuário"}
                                        type={"text"}
                                        onChange={handleChangeFormData}
                                        name={"nome"}
                                        value={formDataUsuario.nome || ""}
                                    />
                                    :
                                    <Input
                                        title={"Digite o nome do usuário"}
                                        placeholder={"Atualize o nome do usuário"}
                                        type={"text"}
                                        onChange={handleChangeFormDataEdicao}
                                        name={"nome"}
                                        value={formDataEdicaoUsuario.nome || ""}
                                    />}

                            </div>
                            <div id="box-item-input">
                                <label>Login:</label>
                                {estadoDoCadastro === "Cadastro" ?
                                    <Input
                                        title={"Digite o login do usuário"}
                                        placeholder={"Digite o login do usuário"}
                                        type={"text"}
                                        onChange={handleChangeFormData}
                                        name={"login"}
                                        value={formDataUsuario.login || ""}
                                    />
                                    :
                                    <Input
                                        title={"Digite o login do usuário"}
                                        placeholder={"Atualize o login do usuário"}
                                        type={"text"}
                                        onChange={handleChangeFormDataEdicao}
                                        name={"login"}
                                        value={formDataEdicaoUsuario.login || ""}
                                    />}
                            </div>

                            <div>
                                <label>Senha:</label>
                                <div className="input-password-wrapper" style={{ width: '200px' }}>
                                    <Input
                                        type={mostrarSenha ? "text" : "password"}
                                        title={"Digite a senha do usuário"}
                                        placeholder={estadoDoCadastro === "Cadastro" ? "Digite a senha do usuário" : "Atualizar senha do usuário"}
                                        className="input-password"
                                        onChange={estadoDoCadastro === "Cadastro" ? handleChangeFormData : handleChangeFormDataEdicao}
                                        name={"senha"}
                                        value={estadoDoCadastro === "Cadastro" ? formDataUsuario.senha || "" : formDataEdicaoUsuario.senha}
                                    />
                                    <Icon
                                        icon={mostrarSenha ? "mdi:eye-off" : "mdi:eye"}
                                        onClick={handleToggleSenha}
                                        className="icon-password"
                                        title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                                    />
                                </div>
                            </div>

                            <div id="box-select-cadastro-user">
                                <label>Tipo de acesso:</label>
                                <select onChange={estadoDoCadastro === "Cadastro" ? handleChangeFormData : handleChangeFormDataEdicao} name="nivelAcesso" value={estadoDoCadastro === "Cadastro" ? formDataUsuario.nivelAcesso || "" : formDataEdicaoUsuario.nivelAcesso || ""}>
                                    <option value={""}>Selecione</option>
                                    <option value={"A"}>Administrador</option>
                                    <option value={"G"}>Geral</option>
                                    <option value={"V"}>Visualização</option>
                                    <option value={"C"}>Coleta</option>
                                </select>
                            </div>

                            {estadoDoCadastro !== "Cadastro" && (
                                <div>
                                    <label>Status:</label>
                                    <select onChange={estadoDoCadastro === "Cadastro" ? handleChangeFormData : handleChangeFormDataEdicao} name="ativo" value={estadoDoCadastro === "Cadastro" ? formDataUsuario.ativo || "" : formDataEdicaoUsuario.ativo || ""}>
                                        <option value={""}>Selecione</option>
                                        <option value={"A"}>Ativo</option>
                                        <option value={"I"}>Inativo</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </form>

                    <div className="buttons-criar-novo-usuario">
                        <div id="botao-criar-usuario">
                            <Button
                                text={estadoDoCadastro === "Cadastro" ? "Cadastrar" : "Atualizar"}
                                onClick={estadoDoCadastro === "Cadastro" ? cadastrarUsuario : atualizarUsuario}
                            />
                        </div>
                        <div id='botao-cancelar-criar-usuario'>
                            <Button
                                text={"Cancelar"}
                                onClick={handleCancelarCadastroOuEdicao}
                            />
                        </div>
                    </div>
                </div>


                <div className="ul-lista-usuarios">
                    <div className='busca-usuario-input' style={{ marginBottom: "10px" }}>
                        <Input
                            type={'text'}
                            placeholder={'Nome'}
                            title={'Pesquise pelo NOME do usuário...'}
                            value={buscaLogin}
                            onChange={(e) => setBuscaLogin(e.target.value)}
                        />
                    </div>

                    <ul>
                        <li id="header-lista-usuarios">
                            <div>ID</div>
                            <div>Nome</div>
                            <div>Login</div>
                            <div>Nivel de Acesso</div>
                            <div>Status</div>
                            <div>Data Criação</div>
                        </li>

                        <>
                            {filteredUsuarios && filteredUsuarios.length > 0 ? (
                                filteredUsuarios.map((user) => {

                                    return (
                                        <li key={user.id} onContextMenu={(e) => handleRightClick(e, user.id, user.nome, user.login, user.nivelAcesso, user.ativo)}
                                            className={`lista-user-1 ${selectedItemId === user.id ? 'lista-user-1-com-cor' : 'lista-user-1-sem-cor'}`}
                                        >
                                            <div>{user.id}</div>
                                            <div>{user.nome}</div>
                                            <div>{user.login}</div>
                                            <div>{nivelAcessoLabels[user.nivelAcesso] || "Não encontrado"}</div>
                                            <div>{user.ativo === "A" ? "Ativo" : "Inativo"}</div>
                                            <div>{formatarData(user.dtCriacao)}</div>
                                        </li>
                                    );
                                })
                            ) : (
                                <div id="nao-existe-usuario">
                                    <li>Ainda não há usuários registrados...</li>
                                </div>
                            )}
                        </>
                    </ul>
                </div>

            </div>


            {contextMenu.visible && (
                <div className='context-menu' style={{
                    top: `${contextMenu.y}px`, left: `${contextMenu.x}px`
                }}>
                    <div id='container-icon-menu' onClick={handleAtualizarUsuario}>
                        <Icon icon="mdi:edit" id='icone-menu' />
                        <p>Editar usuário</p>
                    </div>
                </div>
            )}

            {contextLoading.visible ? (
                <Loading message={estadoDaPagina === "Carregando" ? "Carregando..." : estadoDaPagina === "Atualizando" ? "Atualizando..." : estadoDaPagina === "Salvando" ? "Salvando..." : "Excluindo..."} />
            ) : (
                <></>
            )}

        </div>
    );
}

export default CadastroUsuario;