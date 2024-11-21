import React, { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useFetchUsuarios } from '../../services/Usuarios'; // Hook para buscar usuários
import { useDeleteUsuario } from '../../services/AdminServices'; // Hook para excluir usuário
import { useAuth } from '../../context/AuthContext'; // Para obter o token de autenticação
import Swal from 'sweetalert2'; // Importando SweetAlert2
import axios from 'axios'; // Não esqueça de importar o axios
import '../../styles/Admin/AdminUsuario.css'; // Importando o arquivo de estilos

const Usuarios = () => {
  const { data: usuarios, isLoading, error } = useFetchUsuarios();
  const { token } = useAuth(); // Obter token de autenticação

  const { mutate: deleteUser } = useDeleteUsuario();

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>Erro ao carregar usuários: {error.message}</p>;
  }

  const handleEdit = async (participanteId) => {
    try {
      const response = await axios.get(`https://localhost:7062/Inscricao/${participanteId}/eventos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        title: 'Eventos Inscritos',
        html: generateEventListHtml(response.data),
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText: 'Fechar',
      });
    } catch (error) {
      console.error("Erro ao buscar eventos:", error.response?.data || error.message);
      Swal.fire('Erro!', 'Não foi possível carregar os eventos inscritos.', 'error');
    }
  };

  const generateEventListHtml = (eventos) => {
    if (eventos.length === 0) {
      return '<p>Nenhum evento inscrito.</p>';
    }
    return eventos.map(evento =>
      `<div class="evento-item">
        <h4>${evento.titulo}</h4>
        <p><strong>Descrição:</strong> ${evento.descricao}</p>
        <p><strong>Data e Hora:</strong> ${new Date(evento.dataHora).toLocaleString()}</p>
        <p><strong>Local:</strong> ${evento.local}</p>
        <p><strong>Capacidade Máxima:</strong> ${evento.capacidadeMaxima}</p>
      </div>`
    ).join('');
  };


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
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser({ email, token }, {
          onSuccess: () => {
            Swal.fire('Excluído!', 'O usuário foi excluído com sucesso.', 'success');
          },
          onError: (error) => {
            Swal.fire('Erro!', 'Não foi possível excluir o usuário.', 'error');
          }
        });
      }
    });
  };


  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciar Usuários</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sobrenome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Numero de eventos
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usuarios && usuarios.map((usuario) => (
              <tr key={usuario.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{usuario.nome}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{usuario.sobrenome}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{usuario.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{usuario.numeroEventosInscritos}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <button className="text-indigo-600 hover:text-indigo-900" onClick={() => handleEdit(usuario.id)}>
                      <Edit className="w-5 h-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(usuario.email)}>
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Usuarios;