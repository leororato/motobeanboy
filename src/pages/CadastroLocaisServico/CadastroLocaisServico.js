import { useEffect, useState } from "react";
import api from "../../axiosConfig";
import Header from "../../components/Header/Header";
import ErrorNotification from "../../components/ErrorNotification/ErrorNotification";
import SucessNotification from "../../components/SucessNotification/SucessNotification";
import Loading from "../../components/Loading/Loading";
import './CadastroLocaisServico.css'
import axios from "axios";
import ReactInputMask from "react-input-mask";

function CadastroLocaisServico() {

    const [contextLoading, setContextLoading] = useState(false);
    const [estadoDaPagina, setEstadoDaPagina] = useState("Carregando");

    const [locais, setLocais] = useState([]);

    const [formDataNovoLocalDeServico, setFormDataNovoLocalDeServico] = useState({
        nomeLocal: null,
        telefone: null,
        email: null,
        cnpj: null,
        contratoAtivo: "A"
    })

    const [errorMessage, setErrorMessage] = useState("");
    const [sucessMessage, setSucessMessage] = useState("");

    const handleChangeNovoLocal = (e) => {
        const { name, value } = e.target;
        setFormDataNovoLocalDeServico({
            ...formDataNovoLocalDeServico,
            [name]: value
        })
        console.log('form:', formDataNovoLocalDeServico)
    }

    useEffect(() => {
        buscarLocaisExistentes();
    }, [])

    const buscarLocaisExistentes = async () => {
        setContextLoading(true);
        setEstadoDaPagina("Carregando");

        try {
            const response = await api.get("/local-servico/buscar-todos-locais");
            setLocais(response.data);
            console.log('locais: ', response.data)
        } catch (error) {
            const errorMessage = error.response?.data || "Erro desconhecido ao buscar locais";
            setErrorMessage(errorMessage);
        } finally {
            setContextLoading(false);
        }
    }

    const cadastrarNovoLocal = async (e) => {
        e.preventDefault();
        setContextLoading(true);
        setEstadoDaPagina("Salvando");

        try {
            const localServico = {
                nomeLocal: formDataNovoLocalDeServico.nomeLocal,
                telefone: formDataNovoLocalDeServico.telefone,
                email: formDataNovoLocalDeServico.email,
                cnpj: formDataNovoLocalDeServico.cnpj,
                contratoAtivo: formDataNovoLocalDeServico.contratoAtivo
            }

            await api.post("/local-servico/cadastrar-local-servico", localServico);
            setSucessMessage("Local cadastrado com sucesso");
            buscarLocaisExistentes();

            setFormDataNovoLocalDeServico({
                nomeLocal: null,
                telefone: null,
                email: null,
                cnpj: null,
                contratoAtivo: "A"
            })

        } catch (error) {
            const errorMessage = error.response?.data || "Erro desconhecido ao cadastrar local";
            setErrorMessage(errorMessage);
        } finally {
            setContextLoading(false);
        }
    }

    return (
        <div>
            <Header />
            <ErrorNotification message={errorMessage} onClose={() => { setErrorMessage(null) }} />
            <SucessNotification message={sucessMessage} onClose={() => { setSucessMessage(null) }} />

            <div className="container-cidade">
                <h1>Cadastro de Locais de Serviço</h1>

                <div className="form-cadastro-cidade">
                    <div className="subdiv-container-input-local">
                        <form onSubmit={cadastrarNovoLocal}>
                            <div className="container-input-local">
                                <div id="div-local-input">
                                    <label>Nome do local:</label>
                                    <input
                                        type="text"
                                        placeholder="Digite o nome do local"
                                        value={formDataNovoLocalDeServico.nomeLocal}
                                        name="nomeLocal"
                                        onChange={handleChangeNovoLocal}
                                        style={{
                                            padding: '10px',
                                            borderRadius: '5px',
                                            border: '1px solid #ccc',
                                        }}
                                    />
                                </div>
                                <div id="div-local-input">

                                    <label>Telefone:</label>
                                    <input
                                        type="text"
                                        placeholder="Digite o telefone"
                                        value={formDataNovoLocalDeServico.telefone}
                                        name="telefone"
                                        onChange={handleChangeNovoLocal}
                                        style={{
                                            padding: '10px',
                                            borderRadius: '5px',
                                            border: '1px solid #ccc',
                                        }}
                                    />
                                </div>
                                <div id="div-local-input">

                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        placeholder="Digite o nome da cidade"
                                        value={formDataNovoLocalDeServico.email}
                                        onChange={handleChangeNovoLocal}
                                        name="email"
                                        style={{
                                            padding: '10px',
                                            borderRadius: '5px',
                                            border: '1px solid #ccc',
                                        }}
                                    />
                                </div>
                                <div id="div-local-input">

                                    <label>Cnpj:</label>
                                    {/* <input
                                        type="text"
                                        mask="99.999.999/9999-99"
                                        placeholder="Digite o nome da cidade"
                                        value={formDataNovoLocalDeServico.cnpj}
                                        name="cnpj"
                                        onChange={handleChangeNovoLocal}
                                        style={{
                                            padding: '10px',
                                            borderRadius: '5px',
                                            border: '1px solid #ccc',
                                        }}
                                    /> */}
                                    <ReactInputMask
                                        mask="99.999.999/9999-99"
                                        value={formDataNovoLocalDeServico.cnpj}
                                        name="cnpj"
                                        onChange={handleChangeNovoLocal}
                                        placeholder="Digite o CNPJ"
                                        style={{
                                            padding: '10px',
                                            borderRadius: '5px',
                                            border: '1px solid #ccc',
                                        }}
                                    />
                                </div>
                                <div id="div-local-input">
                                    <label>Status Contrato:</label>
                                    <select type="text"
                                        placeholder="Status"
                                        value={formDataNovoLocalDeServico.contratoAtivo}
                                        name="contratoAtivo"
                                        onChange={handleChangeNovoLocal}
                                        style={{
                                            padding: '10px',
                                            borderRadius: '5px',
                                            border: '1px solid #ccc',
                                        }}>
                                        <option value={"A"}>Ativo</option>
                                        <option value={"I"}>Inativo</option>
                                        <option value={"E"}>Expirado</option>
                                    </select>
                                </div>
                            </div>
                            <div className="container-botao-cadastro">
                                <button type="submit">Cadastrar</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="lista-cidade">
                    <h2>Cidades Cadastradas</h2>
                    <ul>
                        {locais.map((local, index) => (
                            <li key={index}>{local.nomeLocal} - Email: {local.email} - Telefone: {local.telefone}</li>
                        ))}
                    </ul>
                </div>

            </div>

            {
                contextLoading ? (
                    <div>
                        <Loading message={estadoDaPagina === "Carregando" ? "Carregando..." : estadoDaPagina === "Atualizando" ? "Atualizando..." : estadoDaPagina === "Salvando" ? "Salvando..." : "Excluindo..."} />
                    </div>
                ) : (
                    <></>
                )
            }
        </div >
    )
}

export default CadastroLocaisServico;