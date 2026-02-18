import { useMemo, useState } from 'react';
import { Drawer, Modal, StatusBadge } from '../components/ui';
import { useCargoStore } from '../store/cargoStore';
import { Carga } from '../types';
import { isAfter, timeToMinutes } from '../utils/time';

export const GplogPainelPage = () => {
  const { cargas, horaAtual, configuracoes, updateStatus, appendLog } = useCargoStore();
  const [aba, setAba] = useState<'em análise'|'em oferta'|'aceitas'|'encerradas'>('em análise');
  const [selected, setSelected] = useState<Carga | null>(null);
  const [modal, setModal] = useState<{ tipo: 'aceitar'|'recusar'|'devolver'; carga: Carga } | null>(null);
  const [justificativa, setJustificativa] = useState('');

  const rows = useMemo(() => {
    const sorted = [...cargas].sort((a,b) => Number(b.urgente)-Number(a.urgente));
    if (aba === 'aceitas') return sorted.filter(c => c.status === 'agendado');
    if (aba === 'encerradas') return sorted.filter(c => c.status === 'encerrada');
    return sorted.filter(c => c.status === aba);
  }, [cargas, aba]);

  const permiteJanela = isAfter(horaAtual, configuracoes.horarios.h11) && timeToMinutes(horaAtual) < timeToMinutes(configuracoes.horarios.h12);

  return <div>
    <h2>T-07 Painel GPL</h2>
    {timeToMinutes(horaAtual) < timeToMinutes(configuracoes.horarios.h11) && <div>Aguardando importação da grade</div>}
    {['em análise','em oferta','aceitas','encerradas'].map(a => <button key={a} onClick={() => setAba(a as any)}>{a}</button>)}
    {rows.map(c => <div key={c.id} style={{ border:'1px solid #ddd', marginTop: 8, padding: 8 }}>
      <b>{c.codigo}</b> {c.urgente && <span>🔥 urgente</span>} <StatusBadge status={c.status} />
      <button onClick={() => setSelected(c)}>Detalhes</button>
      {(permiteJanela || c.urgente) && c.status === 'em análise' && <>
        <button onClick={() => setModal({ tipo:'aceitar', carga:c })}>Aceitar</button>
        <button onClick={() => setModal({ tipo:'recusar', carga:c })}>Recusar</button>
        <button onClick={() => setModal({ tipo:'devolver', carga:c })}>Devolver PCP</button>
      </>}
    </div>)}
    <Drawer open={!!selected} title="Detalhes da carga" onClose={() => setSelected(null)}>
      {selected && <div><p>{selected.origem} ➜ {selected.destino}</p><a href={`/carga/${selected.id}`}>Ir para /carga/{selected.id}</a>{selected.log.map(l => <div key={l.id}>{l.hora} - {l.acao}</div>)}</div>}
    </Drawer>
    {modal && <Modal title={`Ação ${modal.tipo}`} onClose={() => setModal(null)}>
      {modal.tipo !== 'aceitar' && <textarea placeholder="Justificativa" value={justificativa} onChange={e => setJustificativa(e.target.value)} />}
      <button onClick={() => {
        if (modal.tipo !== 'aceitar' && !justificativa) return;
        if (modal.tipo === 'aceitar') updateStatus(modal.carga.id, 'agendado', 'Aceite GPL confirmado');
        if (modal.tipo === 'recusar') { updateStatus(modal.carga.id, 'em oferta', `Recusada pela GPL: ${justificativa}`); }
        if (modal.tipo === 'devolver') { updateStatus(modal.carga.id, 'devolvida', `Devolvida ao PCP: ${justificativa}`); }
        if (modal.tipo === 'aceitar') appendLog(modal.carga.id, 'Modal T-09 confirmado');
        setJustificativa('');
        setModal(null);
      }}>Confirmar</button>
    </Modal>}
  </div>;
};
