import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { latLng } from 'leaflet';
import Cookies from 'js-cookie';
import AutocompleteEndMapa from '../../components/AutocompleteEndMapa/AutocompleteEndMapa';
import api from '../../axiosConfig';
import ErrorNotification from '../../components/ErrorNotification/ErrorNotification';
import SucessNotification from '../../components/SucessNotification/SucessNotification';
import Loading from '../../components/Loading/Loading';
import { Autocomplete, Box, Button, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MenuAppBar from '../../components/AppBar/AppBar';


// Corrigir o ícone padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function Inicio() {

  const [contextLoading, setContextLoading] = useState(false);
  const [estadoDaPagina, setEstadoDaPagina] = useState("Carregando");

  const [inputTipoDeVeiculoValue, setInputTipoDeVeiculoValue] = useState("");
  const [inputEnderecoDeOrigemValue, setInputEnderecoDeOrigemValue] = useState("");
  const [inputEnderecoDeDestinoValue, setInputEnderecoDeDestinoValue] = useState("");
  const [inputNumeroDaCasaValue, setInputNumeroDaCasaValue] = useState("");

  const [cidadeSelecionada, setCidadeSelecionada] = useState("");
  const [posicaoSelecionada, setPosicaoSelecionada] = useState(null);
  const [enderecoPelaApi, setEnderecoPelaApi] = useState("");
  const [enderecoDigitado, setEnderecoDigitado] = useState("");
  const [numeroDaCasa, setNumeroDaCasa] = useState("");

  const [locais, setLocais] = useState([]);

  const [tiposDeVeiculo, setTiposDeVeiculo] = useState([]);
  const [cidades, setCidades] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [sucessMessage, setSucessMessage] = useState("");

  const buscarTiposDeVeiculo = async () => {
    try {
      const response = await api.get("/tipo-veiculo/todos");
      setTiposDeVeiculo(response.data);
      console.log('tipos de veiculo: ', response.data)
    } catch (error) {
      const errorMessage = error.response?.data || "Erro desconhecido ao criar usuário";
      setErrorMessage(errorMessage);
    }
  }

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

  const buscarCidades = async () => {
    try {

      const response = await api.get("/cidade/buscar-todas-order-by-nome")
      setCidades(response.data);

    } catch (error) {
      const errorMessage = error.response?.data || "Erro desconhecido ao criar usuário";
      setErrorMessage(errorMessage);
    }
  }

  useEffect(() => {

    console.log('input: ', inputTipoDeVeiculoValue)

    buscarTiposDeVeiculo();
    buscarCidades();
    buscarLocaisExistentes();
  }, [])

  // Função para remover o marcador
  const removerMarcador = () => {
    setPosicaoSelecionada(null);
    setEnderecoPelaApi("");
    setEnderecoDigitado("");
  };


  // Função para buscar o nome da rua usando geocodificação reversa (Nominatim)
  const getEnderecoPorLatELong = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar endereço');
      }

      const data = await response.json();

      // Retorna um objeto com as informações desejadas
      return {
        road: data.address.road || "Rua não encontrada",
        state: data.address.state || "Estado não encontrado",
        country: data.address.country || "País não encontrado"
      };
    } catch (error) {
      console.error('Erro ao buscar endereço por latitude e longitude:', error);
      return {
        road: "Rua não encontrada",
        state: "Estado não encontrado",
        country: "País não encontrado"
      };
    }
  };

  function ValorDoMarcador() {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosicaoSelecionada(e.latlng); // Pega a latitude e longitude

        // Busca o nome da rua com base na posição clicada
        getEnderecoPorLatELong(lat, lng).then(({ road, state, country }) => {
          setEnderecoPelaApi(road + ", " + state + ", " + country); // Atualiza o estado com o nome da rua
          setEnderecoDigitado(road + ", " + state + ", " + country);

          // Aqui, usamos o método flyTo para ajustar o mapa e o zoom automaticamente
          map.flyTo(e.latlng, 18); // Você pode ajustar o nível de zoom conforme necessário (18 é um valor alto)
        });
      },
    });

    return posicaoSelecionada ? (
      <Marker position={posicaoSelecionada}>
        <Popup autoOpen={false} closeOnClick={false}>
          Local selecionado: <br />
          Rua: {enderecoPelaApi}
        </Popup>
      </Marker>
    ) : null;
  }

  useEffect(() => {
    console.log('cidadeselecionada: ', cidadeSelecionada)
  }, [cidadeSelecionada])

  const handleChangeCidade = (e) => {
    const cidadeId = e.target.value;
    const cidadeSelecionada = cidades.find(cidade => cidade.idCidade === parseInt(cidadeId));

    if (cidadeSelecionada) {
      setCidadeSelecionada(cidadeSelecionada.nomeCidade);
    }
  };

  return (
    <Box sx={{ textAlign: 'center', width: '100%' }}>
      <MenuAppBar />
      <ErrorNotification message={errorMessage} onClose={() => setErrorMessage(null)} />
      <SucessNotification message={sucessMessage} onClose={() => setSucessMessage(null)} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          height: '100vh',
          paddingTop: '60px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#F8F8F8',
            width: { xs: '100%', md: '700px' },
            boxShadow: 3,
            zIndex: 100,
            padding: 2,
            gap: 2,
          }}
        >
          <Autocomplete
            options={tiposDeVeiculo}
            getOptionLabel={(option) => option.descricao || 'Pesquisar'}
            value={inputTipoDeVeiculoValue || ''}
            onChange={(event, newValue) => setInputTipoDeVeiculoValue(newValue || '')}
            renderInput={(params) => <TextField {...params} label="Tipos de Veículo *" />}
            sx={{ marginBottom: 2 }}
          />

          <Autocomplete
            options={locais}
            getOptionLabel={(option) => option.nomeLocal || 'Pesquisar'}
            value={inputEnderecoDeOrigemValue || ''}
            onChange={(event, newValue) => setInputEnderecoDeOrigemValue(newValue || '')}
            renderInput={(params) => <TextField {...params} label="Endereço de Origem *" />}
            sx={{ marginBottom: 2 }}
          />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Autocomplete
              options={cidades}
              getOptionLabel={(option) => option.nomeCidade || 'Pesquisar'}
              value={inputEnderecoDeDestinoValue || ''}
              onChange={(event, newValue) => setInputEnderecoDeDestinoValue(newValue || '')}
              renderInput={(params) => <TextField {...params} label="Endereço de Destino *" />}
            />

            <TextField
              label="Número"
              variant="outlined"
              type="text"
              onChange={(e) => setNumeroDaCasa(e.target.value)}
            />

            <AutocompleteEndMapa
              setEnderecoDigitado={setEnderecoDigitado}
              enderecoDigitado={enderecoDigitado}
              cidade={cidadeSelecionada}
              numero={numeroDaCasa}
              removerMarcador={removerMarcador}
              setPosicaoSelecionada={setPosicaoSelecionada}
            />
          </Box>

          <TextField
            label="Observações"
            placeholder="Se tiver alguma informação para nos falar, digite aqui..."
            multiline
            variant="filled"
            sx={{ marginTop: 2 }}
          />

          <Button
            variant="contained"
            endIcon={<SendIcon />}
            sx={{ marginTop: 2, backgroundColor: '#1976d2' }}
          >
            SOLICITAR COLETA
          </Button>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            backgroundColor: '#ccc',
            height: '100%',
            zIndex: 10,
          }}
        >
          <MapContainer
            center={[-23.930158615112305, -52.4966926574707]}
            zoom={16}
            className="leaflet-container"
            style={{ height: '100%', width: '100%' }}
            attributionControl={true}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {/* Supondo que ValorDoMarcador seja um componente válido */}
            {posicaoSelecionada && <ValorDoMarcador position={posicaoSelecionada} />}
          </MapContainer>
        </Box>
      </Box>

      {contextLoading && (
        <Box>
          <Loading
            message={
              estadoDaPagina === 'Carregando'
                ? 'Carregando...'
                : estadoDaPagina === 'Atualizando'
                  ? 'Atualizando...'
                  : estadoDaPagina === 'Salvando'
                    ? 'Salvando...'
                    : 'Excluindo...'
            }
          />
        </Box>
      )}
    </Box>
  );
}

export default Inicio;