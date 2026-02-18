import { useMemo, useState } from 'react';
import { Drawer, Modal } from '../components/ui';
import { useCargoStore } from '../store/cargoStore';
import { Transportadora } from '../types';

export const AdminTransportadorasPage = () => {
  const { transportadoras, upsertTransportadora } = useCargoStore();
  const [fStatus, setFStatus] = useState('');
  const [fTipo, setFTipo] = useState('');
  const [fRota, setFRota] = useState('');
  const [selected, setSelected] = useState<Transportadora | null>(null);
  const [score, setScore] = useState<Transportadora | null>(null);

  const rows = useMemo(() => transportadoras.filter(t => (!fStatus || t.status === fStatus) && (!fTipo || t.tipo === fTipo) && (!fRota || t.rotasHomologadas.includes(fRota))), [transportadoras, fStatus, fTipo, fRota]);

  return <div>
    <h2>T-02 Transportadoras</h2>
    <select value={fStatus} onChange={e => setFStatus(e.target.value)}><option value="">Status</option><option>ativa</option><option>suspensa</option><option>inativa</option></select>
    <select value={fTipo} onChange={e => setFTipo(e.target.value)}><option value="">Tipo</option><option>interno</option><option>externo</option></select>
    <input value={fRota} onChange={e => setFRota(e.target.value)} placeholder="Rota" />
    <button onClick={() => setSelected({ id: '', nome: '', cnpj: '', tipo: 'externo', status: 'ativa', rotasHomologadas: [] })}>+ Nova transportadora</button>
    <table><thead><tr><th>Nome</th><th>CNPJ</th><th>Tipo</th><th>Status</th><th>Rotas</th><th>Ações</th></tr></thead><tbody>
      {rows.map(t => <tr key={t.id}><td>{t.nome}</td><td>{t.cnpj}</td><td>{t.tipo}</td><td>{t.status}</td><td>{t.rotasHomologadas.join(', ')}</td><td>
        <button onClick={() => setSelected(t)}>Editar</button>
        <button onClick={() => upsertTransportadora({ ...t, status: t.status === 'inativa' ? 'ativa' : 'inativa' })}>{t.status === 'inativa' ? 'Reativar' : 'Inativar'}</button>
        <button onClick={() => setScore(t)}>Scorecard</button>
      </td></tr>)}
    </tbody></table>
    <Drawer open={Boolean(selected)} title="Cadastro transportadora" onClose={() => setSelected(null)}>
      {selected && <FormTransportadora item={selected} onSave={v => { if (!v.nome || !v.cnpj) return; upsertTransportadora({ ...v, id: v.id || crypto.randomUUID() }); setSelected(null); }} />}
    </Drawer>
    {score && <Modal title="Scorecard mock" onClose={() => setScore(null)}><p>OTIF: 92%</p><p>No show: 1.2%</p><p>Churn: 0.8%</p></Modal>}
  </div>;
};

const FormTransportadora = ({ item, onSave }: { item: Transportadora; onSave: (v: Transportadora) => void }) => {
  const [form, setForm] = useState(item);
  return <div>
    <input value={form.nome} placeholder="Nome*" onChange={e => setForm({ ...form, nome: e.target.value })} />
    <input value={form.cnpj} placeholder="CNPJ*" onChange={e => setForm({ ...form, cnpj: e.target.value })} />
    <input value={form.rotasHomologadas.join(',')} placeholder="Rotas homologadas" onChange={e => setForm({ ...form, rotasHomologadas: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
    <button onClick={() => onSave(form)} disabled={!form.nome || !form.cnpj}>Salvar</button>
  </div>;
};
