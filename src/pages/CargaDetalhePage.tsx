import { useParams } from 'react-router-dom';
import { Modal, StatusBadge } from '../components/ui';
import { useCargoStore } from '../store/cargoStore';
import { useState } from 'react';

export const CargaDetalhePage = () => {
  const { id } = useParams();
  const { cargas, updateStatus, appendLog, simulateVersionUpdate } = useCargoStore();
  const [encerrar, setEncerrar] = useState(false);
  const carga = cargas.find(c => c.id === id);
  if (!carga) return <div>Carga não encontrada</div>;
  return <div>
    <h2>T-15 Detalhe da Carga {carga.codigo}</h2>
    <StatusBadge status={carga.status} />
    <p>Origem {carga.origem} / Destino {carga.destino}</p>
    <p>Peso {carga.peso} / Paletes {carga.paletes}</p>
    {carga.dadosAceite && <pre>{JSON.stringify(carga.dadosAceite, null, 2)}</pre>}
    <button onClick={() => { updateStatus(carga.id, 'no show', 'No show registrado'); updateStatus(carga.id, 'em cotação spot', 'Movida automaticamente para cotação spot'); }}>Registrar no show</button>
    {carga.status === 'em trânsito' && <button onClick={() => setEncerrar(true)}>Encerrar transporte</button>}
    <button onClick={() => simulateVersionUpdate(carga.id)}>Simular atualização de versão</button>
    <h4>Log de auditoria</h4>
    {carga.log.map(l => <div key={l.id}>{l.hora} - {l.usuario} ({l.perfil}) - {l.acao}</div>)}
    {encerrar && <Modal title="T-16 Encerrar transporte" onClose={() => setEncerrar(false)}>
      <input type="date" />
      <input placeholder="Upload mock comprovante" />
      <button onClick={() => { updateStatus(carga.id, 'encerrada', 'Transporte encerrado com comprovante'); appendLog(carga.id, 'T-16 finalizado'); setEncerrar(false); }}>Confirmar</button>
    </Modal>}
  </div>;
};
