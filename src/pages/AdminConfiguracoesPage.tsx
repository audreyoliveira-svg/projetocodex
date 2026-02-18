import { useMemo, useState } from 'react';
import { useCargoStore } from '../store/cargoStore';

export const AdminConfiguracoesPage = () => {
  const { configuracoes, updateConfiguracoes } = useCargoStore();
  const [form, setForm] = useState(configuracoes);
  const soma = useMemo(() => form.pesosRanking.custo + form.pesosRanking.prazo + form.pesosRanking.ocorrencias, [form]);
  return <div>
    <h2>T-04 Configurações</h2>
    <h4>Horários de corte</h4>
    {Object.entries(form.horarios).map(([k,v]) => <div key={k}>{k}<input type="time" value={v} onChange={e => setForm({ ...form, horarios: { ...form.horarios, [k]: e.target.value } })} /></div>)}
    <h4>Pesos ranking (soma {soma}%)</h4>
    {Object.entries(form.pesosRanking).map(([k,v]) => <div key={k}>{k}<input type="number" value={v} onChange={e => setForm({ ...form, pesosRanking: { ...form.pesosRanking, [k]: Number(e.target.value) } })} /></div>)}
    <h4>Penalizações</h4>
    {Object.entries(form.penalizacoes).map(([k,v]) => <div key={k}>{k}<input type="number" value={v} onChange={e => setForm({ ...form, penalizacoes: { ...form.penalizacoes, [k]: Number(e.target.value) } })} /></div>)}
    <button disabled={soma !== 100} onClick={() => updateConfiguracoes({ ...form, historicoAlteracoes: [...form.historicoAlteracoes, `Alterado às ${new Date().toLocaleString()}`] })}>Salvar</button>
    <h4>Histórico</h4>
    {form.historicoAlteracoes.map((h, i) => <div key={i}>{h}</div>)}
  </div>;
};
