import { useEffect, useState } from "react";
import api from "../../axiosConfig";
import Header from "../../components/Header/Header";
import ErrorNotification from "../../components/ErrorNotification/ErrorNotification";
import SucessNotification from "../../components/SucessNotification/SucessNotification";
import Loading from "../../components/Loading/Loading";
import './CadastroCidade.css'
import axios from "axios";

function CadastroCidade() {

    const [contextLoading, setContextLoading] = useState(false);
    const [estadoDaPagina, setEstadoDaPagina] = useState("Carregando");

    const [cidadesDoBrasil, setCidadesDoBrasil] = useState([]);
    const [buscaNomeCidade, setBuscaNomeCidade] = useState("");

    const [cidades, setCidades] = useState([]);
    const [estados, setEstados] = useState([]);
    const [formDataNovaCidade, setFormDataNovaCidade] = useState({
        nomeCidade: null,
        idEstado: null
    })

    const [errorMessage, setErrorMessage] = useState("");
    const [sucessMessage, setSucessMessage] = useState("");

    const buscarCidadesExistentes = async () => {
        setContextLoading(true);
        setEstadoDaPagina("Carregando");

        try {
            const response = await api.get("/cidade/buscar-todas");
            setCidades(response.data);
            console.log('resp: ', response.data)
        } catch (error) {
            const errorMessage = error.response?.data || "Erro desconhecido ao buscar cidades";
            setErrorMessage(errorMessage);
        } finally {
            setContextLoading(false);
        }
    };

    const buscarEstadosExistentes = async () => {
        setContextLoading(true);
        setEstadoDaPagina("Carregando");

        try {
            const response = await api.get("/estado/buscar-todos");
            setEstados(response.data);

        } catch (error) {
            const errorMessage = error.response?.data || "Erro desconhecido ao buscar estados";
            setErrorMessage(errorMessage);
        } finally {
            setContextLoading(false);
        }
    }

    useEffect(() => {
        if (buscaNomeCidade.length < 3) return;

        const buscarCidadesDoBrasilNaApi = async () => {
            try {
                const response = await axios.get(`https://brasilapi.com.br/api/cptec/v1/cidade/${buscaNomeCidade}`);
                setCidadesDoBrasil(response.data);
            } catch (error) {
                console.error("Erro ao buscar cidades:", error);
            }
        };

        buscarCidadesDoBrasilNaApi();
    }, [buscaNomeCidade]);

    const cadastrarNovaCidade = async () => {
        setContextLoading(true);
        setEstadoDaPagina("Salvando");

        const formData = {
            nomeCidade: formDataNovaCidade.nomeCidade,
            estado: {
                idEstado: formDataNovaCidade.idEstado
            }
        }

        try {
            await api.post("/cidade/cadastro-cidade", formData);
            buscarCidadesExistentes();
        } catch (error) {
            const errorMessage = error.response?.data || "Erro desconhecido ao cadastrar cidade";
            setErrorMessage(errorMessage);
        } finally {
            setContextLoading(false);
        }
    };

    useEffect(() => {
        buscarCidadesExistentes();
        buscarEstadosExistentes();
    }, []);

    const handleChangeBuscaCidade = (event) => {
        setBuscaNomeCidade(event.target.value);
    };



    const handleChangeEstado = (event) => {
        setFormDataNovaCidade({
            ...formDataNovaCidade,
            idEstado: event.target.value,
        });
    };

    const handleSelectCidade = (cidade) => {
        setBuscaNomeCidade(cidade.nome);
        setCidadesDoBrasil([]);

        setFormDataNovaCidade({
            ...formDataNovaCidade,
            nomeCidade: cidade.nome,
        });
    };

    return (
        <div>
            <Header />
            <ErrorNotification message={errorMessage} onClose={() => { setErrorMessage(null) }} />
            <SucessNotification message={sucessMessage} onClose={() => { setSucessMessage(null) }} />

            <div className="container-cidade">
                <h1>Cadastro de Cidades</h1>

                <div className="form-cadastro-cidade">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label>Nome da cidade:</label>
                        <input
                            type="text"
                            placeholder="Digite o nome da cidade"
                            value={buscaNomeCidade}
                            onChange={handleChangeBuscaCidade}
                            style={{
                                padding: '10px',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                            }}
                        />
                        {buscaNomeCidade.length >= 3 && cidadesDoBrasil.length > 0 && (
                            <div style={{
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                position: 'absolute',
                                backgroundColor: 'white',
                                width: '220px',
                                marginTop: '57px',
                                zIndex: '999',
                            }}>
                                {cidadesDoBrasil.map((cidade) => (
                                    <div
                                        key={cidade.id}
                                        onClick={() => handleSelectCidade(cidade)}
                                        style={{
                                            padding: '10px',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid #ddd',
                                        }}
                                    >
                                        {cidade.nome} - {cidade.estado}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>

                        <label>Estado: </label>

                        <select onChange={handleChangeEstado} 
                            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
                            <option value={""}>Selecione</option>
                            {estados.map((estado) => (
                                <option key={estado.idEstado} value={estado.idEstado}>
                                    {estado.sigla} - {estado.nomeEstado}
                                </option>
                            ))}
                        </select>

                    </div>

                    <div className="botao-cadastro-cidade">
                        <button onClick={cadastrarNovaCidade}>Cadastrar</button>
                    </div>
                </div>

                <div className="lista-cidade">
                    <h2>Cidades Cadastradas</h2>
                    <ul>
                        {cidades.map((cidade, index) => (
                            <li key={index}>{cidade.nomeCidade} - {cidade.estado.nomeEstado}</li>
                        ))}
                    </ul>
                </div>

            </div>

            {contextLoading.visible ? (
                <div>
                    <Loading message={estadoDaPagina === "Carregando" ? "Carregando..." : estadoDaPagina === "Atualizando" ? "Atualizando..." : estadoDaPagina === "Salvando" ? "Salvando..." : "Excluindo..."} />
                </div>
            ) : (
                <></>
            )}
        </div>
    )
}

export default CadastroCidade;