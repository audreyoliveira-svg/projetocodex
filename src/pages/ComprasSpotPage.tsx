import { useState } from 'react';
import { useCargoStore } from '../store/cargoStore';

export const ComprasSpotPage = () => {
  const { cargas, appendLog } = useCargoStore();
  const [id, setId] = useState('');
  const [form, setForm] = useState({ transportadora: '', valor: '', justificativa: '' });
  const rows = cargas.filter(c => c.status === 'em cotação spot');
  return <div>
    <h2>T-12 Cotação Spot</h2>
    {rows.map(c => <div key={c.id}><input type="radio" name="sel" onChange={() => setId(c.id)} />{c.codigo}</div>)}
    <h4>Registrar cotação</h4>
    <input placeholder="transportadora spot" value={form.transportadora} onChange={e => setForm({ ...form, transportadora: e.target.value })} />
    <input placeholder="valor" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} />
    <input placeholder="justificativa" value={form.justificativa} onChange={e => setForm({ ...form, justificativa: e.target.value })} />
    <button disabled={!id} onClick={() => appendLog(id, `Cotação spot registrada ${JSON.stringify(form)}`)}>Salvar cotação</button>
    <h4>Custos extras (visual)</h4>
    <div>Pedágio extra: pendente</div><div>Diária: aprovado</div><div>Taxa risco: reprovado</div>
  </div>;
};
