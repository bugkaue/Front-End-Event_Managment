import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFetchInscricoes } from '../services/Inscricao';
import { useRemoveInscricao } from '../services/Inscricao';
import Swal from 'sweetalert2'; 
import '../styles/Inscricoes.css';
import carinhatriste from '../assets/carinhatriste.png';
import { MapPin, Clock, Users } from 'lucide-react';

const Inscricoes = () => {
  const { token, participante } = useAuth();
  const { data: inscricoes, error, isLoading } = useFetchInscricoes(token, participante?.id);
  const { mutate: removerInscricao } = useRemoveInscricao();
  const [visibleCount, setVisibleCount] = useState(3);

  if (isLoading) return <p>Carregando inscrições...</p>;

  const hasSubscriptions = !!inscricoes?.length && !error;

  const handleRemoveInscricao = (eventoId) => {
    Swal.fire({
      title: 'Tem certeza?',
      text: "Você não poderá reverter essa ação!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, cancelar!',
      cancelButtonText: 'Não, voltar!',
      customClass: {
        popup: 'custom-modal',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        removerInscricao({
          eventoId: eventoId,
          participanteId: participante.id,
        });
        Swal.fire(
          'Cancelado!',
          'Sua inscrição foi cancelada.',
          'success',
          {
            customClass: {
              popup: 'custom-modal',
            }
          }
        );
      }
    });
  };

  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 3);
  };

  return (
    <div className='p-8'>
      <div className="eventos-container">
        <h2 className="text-3xl font-bold mb-8">Meus Eventos</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hasSubscriptions ? (
            inscricoes?.slice(0, visibleCount).map((inscricao) => (
              <div key={inscricao.eventoId} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{inscricao.titulo}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{inscricao.local}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{new Date(inscricao.dataHora).toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{inscricao.descricao}</p>
                  <button 
                    className='w-full py-2 px-4 rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors'
                    onClick={() => handleRemoveInscricao(inscricao.eventoId)}>
                    Cancelar Inscrição
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="sem-inscricoes text-center text-gray-500 py-8">
              <p className="text-xl">
                <strong>Você ainda não está inscrito em nenhum evento.</strong>
              </p>
              <img src={carinhatriste} alt="Carinha Triste" className="triste-imagem mt-2" />
            </div>
          )}
        </div>
        
        {hasSubscriptions && inscricoes.length > visibleCount && (
          <div className="mt-6 text-center">
            <button 
              onClick={loadMore}
              className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              Carregar mais inscrições
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Inscricoes;
