import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Edit, Trash2, Plus, LucideDownload } from 'lucide-react';
import {
  useFetchEventos,
  useCreateEvento,
  useUpdateEvento,
  useDeleteEvento,
} from '../../services/Eventos';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Admin/AdminEventos.css';
import { useGerarRelatorio } from '../../services/Inscricao';

const AdminEventos = () => {
  const { token } = useAuth();
  const { data: eventos = [], isLoading, error } = useFetchEventos(token);
  const deleteEvento = useDeleteEvento();
  const createEvento = useCreateEvento();
  const updateEvento = useUpdateEvento();
  const { gerarRelatorio } = useGerarRelatorio();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredEventos = eventos.filter((evento) => {
    const matchesSearchTerm = evento.titulo
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    let matchesStatus = true;

    if (statusFilter === 'available') {
      matchesStatus =
        evento.isAtivo && evento.numeroInscricoes < evento.capacidadeMaxima;
    } else if (statusFilter === 'ended') {
      matchesStatus = !evento.isAtivo;
    } else if (statusFilter === 'soldout') {
      matchesStatus = evento.numeroInscricoes >= evento.capacidadeMaxima;
    }

    return matchesSearchTerm && matchesStatus;
  });

  const handleNovoEvento = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Criar Novo Evento',
      html: `
        <input id="swal-titulo" class="swal2-input" placeholder="Título">
        <textarea id="swal-descricao" class="swal2-textarea" placeholder="Descrição"></textarea>
        <input id="swal-dataHora" type="datetime-local" class="swal2-input">
        <input id="swal-local" class="swal2-input" placeholder="Local">
        <input id="swal-capacidadeMaxima" type="number" min="1" class="swal2-input" placeholder="Capacidade Máxima">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Criar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return {
          titulo: document.getElementById('swal-titulo').value,
          descricao: document.getElementById('swal-descricao').value,
          dataHora: document.getElementById('swal-dataHora').value,
          local: document.getElementById('swal-local').value,
          capacidadeMaxima: document.getElementById('swal-capacidadeMaxima')
            .value,
        };
      },
    });

    if (formValues) {
      const dataHoraEvento = new Date(formValues.dataHora);
      const dataHoraAtual = new Date();
      const dataLimite = new Date(dataHoraAtual.getFullYear() + 5, 11, 31);

      if (dataHoraEvento < dataHoraAtual) {
        Swal.fire(
          'Erro!',
          'Não é possível criar um evento em uma data que já passou.',
          'error'
        );
        return;
      }

      if (dataHoraEvento > dataLimite) {
        Swal.fire(
          'Erro!',
          'Não é possível criar um evento para uma data tão distante.',
          'error'
        );
        return;
      }

      try {
        createEvento.mutate(
          { token, data: formValues },
          {
            onSuccess: () =>
              Swal.fire('Sucesso!', 'Evento criado com sucesso.', 'success'),
            onError: (error) => {
              console.error('Erro ao criar evento:', error);
              Swal.fire('Erro!', 'Não foi possível criar o evento.', 'error');
            },
          }
        );
      } catch (error) {
        console.error('Erro ao criar evento:', error);
        Swal.fire('Erro!', 'Não foi possível criar o evento.', 'error');
      }
    }
  };

  const handleEditarEvento = async (evento) => {
    const { value: formValues } = await Swal.fire({
      title: 'Editar Evento',
      html: `
        <input id="swal-titulo" class="swal2-input" value="${evento.titulo}">
        <textarea id="swal-descricao" class="swal2-textarea">${evento.descricao}</textarea>
        <input id="swal-dataHora" type="datetime-local" class="swal2-input" value="${new Date(
          evento.dataHora
        )
          .toISOString()
          .slice(0, 16)}">
        <input id="swal-local" class="swal2-input" value="${evento.local}">
        <input id="swal-capacidadeMaxima" type="number" min="1" class="swal2-input" value="${evento.capacidadeMaxima}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return {
          titulo: document.getElementById('swal-titulo').value,
          descricao: document.getElementById('swal-descricao').value,
          dataHora: document.getElementById('swal-dataHora').value,
          local: document.getElementById('swal-local').value,
          capacidadeMaxima: document.getElementById('swal-capacidadeMaxima')
            .value,
        };
      },
    });

    if (formValues) {
      const dataHoraEvento = new Date(formValues.dataHora);
      const dataHoraAtual = new Date();
      const dataLimite = new Date(dataHoraAtual.getFullYear() + 5, 11, 31);

      if (dataHoraEvento < dataHoraAtual) {
        Swal.fire(
          'Erro!',
          'Não é possível atualizar um evento em uma data que já passou.',
          'error'
        );
        return;
      }

      if (dataHoraEvento > dataLimite) {
        Swal.fire(
          'Erro!',
          'Não é possível atualizar um evento para uma data tão distante.',
          'error'
        );
        return;
      }

      try {
        updateEvento.mutate(
          { token, id: evento.id, data: formValues },
          {
            onSuccess: () =>
              Swal.fire('Sucesso!', 'Evento atualizado com sucesso.', 'success'),
            onError: (error) => {
              console.error('Erro ao atualizar evento:', error);
              Swal.fire(
                'Erro!',
                'Não foi possível atualizar o evento.',
                'error'
              );
            },
          }
        );
      } catch (error) {
        console.error('Erro ao atualizar evento:', error);
        Swal.fire('Erro!', 'Não foi possível atualizar o evento.', 'error');
      }
    }
  };

  const handleDeleteEvento = async (evento) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Você não poderá reverter isso!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
    });

    if (isConfirmed) {
      try {
        deleteEvento.mutate(
          { token, id: evento.id },
          {
            onSuccess: () =>
              Swal.fire(
                'Excluído!',
                'O evento foi excluído com sucesso.',
                'success'
              ),
            onError: (error) => {
              console.error('Erro ao excluir evento:', error);
              Swal.fire('Erro!', 'Não foi possível excluir o evento.', 'error');
            },
          }
        );
      } catch (error) {
        console.error('Erro ao excluir evento:', error);
        Swal.fire('Erro!', 'Não foi possível excluir o evento.', 'error');
      }
    }
  };

  if (isLoading) return <p>Carregando eventos...</p>;
  if (error) return <p>Erro ao carregar eventos: {error.message}</p>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciar Eventos</h1>
        <button
          onClick={handleNovoEvento}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Evento
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Pesquisar eventos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="all">Todos</option>
            <option value="available">Disponíveis</option>
            <option value="ended">Encerrados</option>
            <option value="soldout">Lotados</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Evento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Local
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data e Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capacidade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inscrições
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEventos.map((evento) => (
              <tr key={evento.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {evento.titulo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {evento.local}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(evento.dataHora).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {evento.capacidadeMaxima}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {evento.numeroInscricoes}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      evento.isAtivo
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {evento.isAtivo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4">
                  <button
                    onClick={() => handleEditarEvento(evento)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit />
                  </button>
                  <button
                    onClick={() => handleDeleteEvento(evento)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 />
                  </button>
                  <button
                    onClick={() => gerarRelatorio(evento.id, token)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <LucideDownload />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminEventos;