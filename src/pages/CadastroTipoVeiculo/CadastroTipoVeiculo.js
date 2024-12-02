import { useEffect, useState } from "react";
import api from "../../axiosConfig";
import './CadastroTipoVeiculo.css'
import Header from "../../components/Header/Header";
import ErrorNotification from "../../components/ErrorNotification/ErrorNotification";
import SucessNotification from "../../components/SucessNotification/SucessNotification";

function CadastroTipoVeiculo() {
    const [tiposDeVeiculo, setTiposDeVeiculo] = useState([]);
    const [novoTipo, setNovoTipo] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [sucessMessage, setSucessMessage] = useState("");

    const buscarTiposDeVeiculoExistentes = async () => {
        try {
            const response = await api.get("/tipo-veiculo/todos");
            setTiposDeVeiculo(response.data);
        } catch (error) {
            const errorMessage = error.response?.data || "Erro desconhecido ao criar usuário";
            setErrorMessage(errorMessage);
        }
    };

    const cadastrarNovoTipo = async () => {
        if (!novoTipo) return alert("Preencha o tipo de veículo!");
        await api.post("/tipo-veiculo/cadastrar-tipo-veiculo", { descricao: novoTipo });
        setNovoTipo("");
        buscarTiposDeVeiculoExistentes();
    };

    useEffect(() => {
        buscarTiposDeVeiculoExistentes();
    }, []);

    return (
        <div>
            <Header />
            <ErrorNotification message={errorMessage} onClose={() => { setErrorMessage(null) }} />
            <SucessNotification message={sucessMessage} onClose={() => { setSucessMessage(null) }} />

            <div className="container">
                <h1>Cadastro de Tipos de Veículo</h1>

                {/* Formulário para cadastro */}
                <div className="form-cadastro">
                    <input
                        type="text"
                        placeholder="Digite o tipo de veículo"
                        value={novoTipo}
                        onChange={(e) => setNovoTipo(e.target.value)}
                    />
                    <button onClick={cadastrarNovoTipo}>Cadastrar</button>
                </div>

                {/* Listagem */}
                <div className="lista-veiculos">
                    <h2>Tipos de Veículos Cadastrados</h2>
                    <ul>
                        {tiposDeVeiculo.map((tipo, index) => (
                            <li key={index}>{tipo.descricao}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default CadastroTipoVeiculo;
