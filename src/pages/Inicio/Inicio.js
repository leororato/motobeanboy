import './Inicio.css';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { latLng } from 'leaflet';
import { Icon } from '@iconify/react/dist/iconify.js';
import Cookies from 'js-cookie';
import AutocompleteEndMapa from '../../components/AutocompleteEndMapa/AutocompleteEndMapa';
import Header from '../../components/Header/Header';
import api from '../../axiosConfig';
import ErrorNotification from '../../components/ErrorNotification/ErrorNotification';
import SucessNotification from '../../components/SucessNotification/SucessNotification';

// Corrigir o ícone padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function Inicio() {

  const [cidadeDigitada, setCidadeDigitada] = useState("");
  const [posicaoSelecionada, setPosicaoSelecionada] = useState(null);
  const [enderecoPelaApi, setEnderecoPelaApi] = useState("");
  const [enderecoDigitado, setEnderecoDigitado] = useState("");
  const [enderecoInput, setEnderecoInput] = useState("");
  const [numeroDaCasa, setNumeroDaCasa] = useState("");

  const [tiposDeVeiculo, setTiposDeVeiculo] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [sucessMessage, setSucessMessage] = useState("");

  const buscarTiposDeVeiculo = async () => {
    try {
      const response = await api.get("/tipo-veiculo/todos");
      setTiposDeVeiculo(response.data);
      console.log('resp: ', response.data)

    } catch (error) {
      const errorMessage = error.response?.data || "Erro desconhecido ao criar usuário";
      setErrorMessage(errorMessage);
    }
  }

  useEffect(() => {
    buscarTiposDeVeiculo();
  }, [])

  // Função para remover o marcador
  const removerMarcador = () => {
    setPosicaoSelecionada(null); // Remove a posição do marcador
    setEnderecoPelaApi(""); // Limpa o endereço
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

  // Componente para capturar clique no mapa
  function ValorDoMarcador() {

    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosicaoSelecionada(e.latlng); // Pega a latitude e longitude
        console.log(e.latlng)
        // Busca o nome da rua com base na posição clicada
        getEnderecoPorLatELong(lat, lng).then(({ road, state, country }) => {
          // Desestrutura o objeto retornado
          setEnderecoPelaApi(road + ", " + state + ", " + country); // Atualiza o estado com o nome da rua
          setEnderecoDigitado(road + ", " + state + ", " + country);
          // Move a visualização para o local clicado e abre o popup imediatamente
          map.flyTo(e.latlng, map.getZoom());
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


  return (
    <div className="App">
      <Header />
      <ErrorNotification message={errorMessage} onClose={() => { setErrorMessage(null) }} />
      <SucessNotification message={sucessMessage} onClose={() => { setSucessMessage(null) }} />

      <div className="container-page">
        <div className="container-inputs">
          {/* <div id='title'>
            <h1>MotoBeanBoy</h1>
          </div> */}

          <div className='subcontainer-inputs'>
            <div id='div-servico-adicional' style={{ marginBottom: '20px' }}>
              <label>Serviço adicional</label>
              <select>
                <option>Selecione</option>
                <option selected>SERVIÇO DE ENTREGA NORMAL | R$ 0,00"</option>
              </select>
            </div>

            <div id='div-veiculo-retorno' style={{ marginBottom: '20px' }}>
              <div>
                <label>Veículo</label>
                <select>
                  <option value="">Selecione</option>
                  {tiposDeVeiculo.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.descricao}
                    </option>
                  ))}
                </select>

              </div>

              <div>
                <label>Retorno</label>
                <select defaultValue={false}>
                  <option value={false}>NÃO</option>
                  <option value={true}>SIM</option>
                </select>
              </div>
            </div>

            <div id='div-endereco' style={{ marginBottom: '20px' }}>
              <label>Endereço de origem</label>
              <select defaultValue={"Araruna"}>
                <option value='Araruna'>Farmácia 1</option>
                <option value='Campo Mourão'>Farmácia 2</option>
                <option value='Cianorte'>Farmácia 3</option>
              </select>
            </div>

            <div id='div-endereco' style={{ marginBottom: '20px' }}>
              <label>Endereço de destino</label>
              <select onChange={(e) => setCidadeDigitada(e.target.value)}>
                <option value='Araruna'>Araruna</option>
                <option value='Campo Mourão'>Campo Mourão</option>
                <option value='Cianorte'>Cianorte</option>
              </select>
              <input
                placeholder='Número'
                type='number'
                onChange={(e) => setNumeroDaCasa(e.target.value)}
              />
              <div style={{ display: 'flex', position: 'relative', width: '100%' }}>
                <AutocompleteEndMapa
                  setEnderecoDigitado={setEnderecoDigitado}
                  enderecoDigitado={enderecoDigitado}
                  cidade={cidadeDigitada}
                  numero={numeroDaCasa}
                  style={{ paddingRight: '30px', width: '100%' }}
                  removerMarcador={removerMarcador}
                  setPosicaoSelecionada={setPosicaoSelecionada}
                />
              </div>
            </div>

            <div id='div-obs'>
              <label>Observações</label>
              <textarea placeholder='Se tiver alguma informação para nos falar digite aqui...' />
            </div>

            <div id='div-status-tempo'>
              <div>
                <p>Tempo Coleta: 30 minutos</p>
                <p>Tempo Entrega: 30 minutos</p>
                <p>Distância: 0,0 km</p>
              </div>
              <div id='div-total-solicitacao'>
                <p>Total:</p>
                <p>R$ 0,00</p>
              </div>
            </div>

            <div id='div-botao-solicitar'>
              <button>SOLICITAR COLETA</button>
            </div>


          </div>
        </div>

        <div className="container-map">
          <MapContainer
            center={[-23.930158615112305, -52.4966926574707]}
            zoom={16}
            className="leaflet-container"
            attributionControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ValorDoMarcador />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default Inicio;