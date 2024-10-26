import React from 'react';
import { useFetchUsuarios } from '../services/Usuarios'; // Hook para buscar usuários
import { useDeleteUsuario } from '../services/AdminServices'; // Hook para excluir usuário
import { useAuth } from '../context/AuthContext'; // Para obter o token de autenticação
import Swal from 'sweetalert2'; // Importando SweetAlert2
import '../styles/AdminUsuario.css'; // Importando o arquivo de estilos

const Usuarios = () => {
  // Hook para buscar dados dos usuários
  const { data: usuarios, isLoading, error } = useFetchUsuarios();
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
              <button className='editButton'>Editar</button>
              <button onClick={() => handleDelete(usuario.email)} className='deleteButton'>Deletar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Usuarios;
