import React, { useState } from 'react';
import { useFetchUsuarios } from '../services/Usuarios'; // Hook para buscar usuários
import { useDeleteUsuario } from '../services/AdminServices'; // Hook para excluir usuário
import { useAuth } from '../context/AuthContext'; // Para obter o token de autenticação
import Swal from 'sweetalert2'; // Importando SweetAlert2
import axios from 'axios'; // Não esqueça de importar o axios
import '../styles/AdminUsuario.css'; // Importando o arquivo de estilos

const Usuarios = () => {
  // Hook para buscar dados dos usuários
  const { data: usuarios, isLoading, error } = useFetchUsuarios();
  const [eventosInscritos, setEventosInscritos] = useState([]);
  const { token } = useAuth(); // Obter token de autenticação

  // Hook para deletar usuário
  const { mutate: deleteUser } = useDeleteUsuario();

  // Verifique se está carregando ou se houve um erro
  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>Erro ao carregar usuários: {error.message}</p>;
  }

  const handleEdit = async (participanteId) => {
    try {
      const response = await axios.get(`https://localhost:7062/Eventos/participante/${participanteId}/inscricoes`, {
        headers: {
          Authorization: `Bearer ${token}`, // Substitua pelo seu token
        },
      });
      setEventosInscritos(response.data);
      
      // Exibir os eventos em um modal
      Swal.fire({
        title: 'Eventos Inscritos',
        html: generateEventListHtml(response.data), // Gerar a lista de eventos como HTML
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText: 'Fechar',
      });
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
      Swal.fire('Erro!', 'Não foi possível carregar os eventos inscritos.', 'error');
    }
  };

 const generateEventListHtml = (eventos) => {
  if (eventos.length === 0) {
    return '<p>Nenhum evento inscrito.</p>';
  }
  return eventos.map(evento => `
    <div class="evento-item">  <!-- Adicione uma classe aqui -->
      <h4>${evento.titulo}</h4>
      <p><strong>Descrição:</strong> ${evento.descricao}</p>
      <p><strong>Data e Hora:</strong> ${new Date(evento.dataHora).toLocaleString()}</p>
      <p><strong>Local:</strong> ${evento.local}</p>
      <p><strong>Capacidade Máxima:</strong> ${evento.capacidadeMaxima}</p>
    </div>
  `).join('');
};

  // Função para deletar usuário com confirmação
  const handleDelete = (email) => {
    Swal.fire({
      title: 'Tem certeza?',
      text: "Você não poderá reverter essa ação!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Não, voltar!',
      customClass: {
        popup: 'custom-modal', // Adiciona a classe personalizada ao modal
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser({ email, token }); // Chama o hook para excluir o usuário
        Swal.fire(
          'Excluído!',
          'O usuário foi excluído com sucesso.',
          'success',
          {
            customClass: {
              popup: 'custom-modal', // Adiciona a classe personalizada ao modal
            }
          }
        );
      }
    });
  };

  return (
    <div className='usuarioContainer'>
      <h1>Lista de Usuários</h1>
      <div className='usuariosLista'>
        {usuarios && usuarios.map((usuario) => (
          <div key={usuario.id} className='usuarioItem'>
            <div className='usuarioInfo'>
              <span><strong>Nome:</strong> {usuario.nome}</span>
              <span><strong>Sobrenome:</strong> {usuario.sobrenome}</span>
              <span><strong>Email:</strong> {usuario.email}</span>
            </div>
            <div className='usuarioAcoes'>
              <button className='editButton' onClick={() => handleEdit(usuario.id)}>Eventos Inscritos</button>
              <button onClick={() => handleDelete(usuario.email)} className='deleteButton'>Deletar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Usuarios;
