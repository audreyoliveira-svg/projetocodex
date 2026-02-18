import { useMemo, useState } from 'react';
import { Modal, StatusBadge } from '../components/ui';
import { useCargoStore } from '../store/cargoStore';
import { Carga } from '../types';
import { isAfter, timeToMinutes } from '../utils/time';

export const TransportadoraOfertasPage = () => {
  const { cargas, sessao, transportadoras, horaAtual, configuracoes, updateStatus, appendLog } = useCargoStore();
  const [selected, setSelected] = useState<Carga | null>(null);
  const [form, setForm] = useState({ placa: '', motorista: '', cpf: '', tipoCaminhao: '', capacidade: '' });
  const transportadora = transportadoras.find(t => t.id === sessao?.transportadoraId);

  const ofertas = useMemo(() => {
    const base = cargas.filter(c => c.status === 'em oferta' || c.urgente);
    if (!transportadora || transportadora.status !== 'ativa') return [];
    return base.filter(c => c.urgente || transportadora.rotasHomologadas.includes(c.rota));
  }, [cargas, transportadora]);

  const bloqueado = !isAfter(horaAtual, configuracoes.horarios.h12);
  const restante = Math.max(0, timeToMinutes(configuracoes.horarios.h1530) - timeToMinutes(horaAtual));

  return <div>
    <h2>T-08 Ofertas transportadora</h2>
    {bloqueado && <div>Ofertas serão liberadas às 12:00</div>}
    <div>Contador até 15:30: {restante} min</div>
    {(!bloqueado ? ofertas : ofertas.filter(c => c.urgente)).map(c => <div key={c.id}>{c.codigo} <StatusBadge status={c.status} />
      <button onClick={() => setSelected(c)}>Aceitar frete</button>
      <button onClick={() => { updateStatus(c.id, 'em oferta', 'Recusado pela transportadora'); appendLog(c.id, 'Penalização mock por recusa aplicada'); }}>Recusar</button>
    </div>)}
    {selected && <Modal title="T-10 Aceitar frete" onClose={() => setSelected(null)}>
      {Object.entries(form).map(([k,v]) => <input key={k} placeholder={k} value={v} onChange={e => setForm({ ...form, [k]: e.target.value })} />)}
      <button disabled={Object.values(form).some(v => !v)} onClick={() => {
        updateStatus(selected.id, 'agendado', 'Aceite da transportadora confirmado');
        appendLog(selected.id, `Dados aceite: ${JSON.stringify(form)}`);
        setSelected(null);
      }}>Confirmar</button>
    </Modal>}
  </div>;
};
