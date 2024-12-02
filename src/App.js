import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Inicio from './pages/Inicio/Inicio';
import Login from './pages/Usuario/Login/Login';
import CadastroUsuario from './pages/Usuario/CadastroUsuario/CadastroUsuario';
import CadastroTipoVeiculo from './pages/CadastroTipoVeiculo/CadastroTipoVeiculo';
import CadastroCidade from './pages/CadastroCidade/CadastroCidade';


function App() {
    
  const userRole = Cookies.get('nivelAcesso');

  return (
      <Router>
          <Routes>
              <Route path='/' element={<Navigate to="/login" />} />
              <Route path='/login' element={<Login />} />
              <Route path='/inicio' element={<Inicio />} />
              <Route path='/cadastrar-usuario' element={<CadastroUsuario />} />
              <Route path='/cadastrar-tipo-veiculo' element={<CadastroTipoVeiculo />} />
              <Route path='/cadastrar-cidade' element={<CadastroCidade />} />
              
          </Routes>
      </Router>
  );
}

export default App;