import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useFetchInscricoes } from '../services/Inscricao';
import { useRemoveInscricao } from '../services/Inscricao';
import Swal from 'sweetalert2'; // Importando SweetAlert2
import '../styles/Inscricoes.css';
import carinhatriste from '../assets/carinhatriste.png';

const Inscricoes = () => {
  const { token, participante } = useAuth();
  const { data: inscricoes, error, isLoading } = useFetchInscricoes(token, participante?.id);
  const { mutate: removerInscricao } = useRemoveInscricao();

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
        popup: 'custom-modal', // Adiciona a classe personalizada ao modal
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
              popup: 'custom-modal', // Adiciona a classe personalizada ao modal
            }
          }
        );
      }
    });
  };

  return (
    <div>
      <div className="eventos-container">
        <h2 className='eventos-titulo'>Eventos em que você está inscrito</h2>

        <div className="event-list">
          {hasSubscriptions ? (
            inscricoes?.map((inscricao, index) => (
              <div key={index} className="event-item">
                <h3>{inscricao.titulo}</h3>
                <p><strong>Descrição:</strong> {inscricao.descricao}</p>
                <p><strong>Data e Hora:</strong> {new Date(inscricao.dataHora).toLocaleString()}</p>
                <p><strong>Local:</strong> {inscricao.local}</p>
                <p><strong>Capacidade Máxima:</strong> {inscricao.capacidadeMaxima}</p>

                <button 
                  className='cancelar-inscricao-button'
                  onClick={() => handleRemoveInscricao(inscricao.eventoId)}>
                  Cancelar Inscrição
                </button>
              </div>
            ))
          ) : null}
        </div>
      </div>
      
      {!hasSubscriptions && (
        <div className="sem-inscricoes">
          <p className='eventos-titulo'>
            <strong>Você ainda não está inscrito em nenhum evento.</strong>
          </p>
          <img src={carinhatriste} alt="Carinha Triste" className="triste-imagem" />
        </div>
      )}
    </div>
  );
}

export default Inscricoes;
