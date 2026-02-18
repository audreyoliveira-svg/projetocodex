import { useMemo } from 'react';
import { useCargoStore } from '../store/cargoStore';

export const TorreControlePage = () => {
  const { cargas, horaAtual, configuracoes } = useCargoStore();
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    cargas.forEach(c => map.set(c.status, (map.get(c.status) || 0) + 1));
    return [...map.entries()];
  }, [cargas]);
  const aceitas = cargas.filter(c => c.status === 'agendado' || c.status === 'encerrada').length;
  const kpis = {
    aceitas: `${Math.round((aceitas / cargas.length) * 100)}%`,
    spot: `${Math.round((cargas.filter(c => c.status === 'em cotação spot').length / cargas.length) * 100)}%`,
    noShow: `${Math.round((cargas.filter(c => c.status === 'no show').length / cargas.length) * 100)}%`,
    tempoAceite: '48 min'
  };

  return <div>
    <h2>T-14 Torre de Controle</h2>
    <div>Linha do tempo: 11:00 | 11:30 | 12:00 | 15:00 | 15:30 | Agora {horaAtual}</div>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{counts.map(([s,n]) => <div key={s} style={{ border:'1px solid #ddd', padding: 8 }}>{s}: {n}</div>)}</div>
    <h4>Tabela geral</h4>
    {cargas.map(c => <div key={c.id}>{c.codigo} - {c.status} - {c.rota}</div>)}
    <h4>KPIs</h4>
    <div>% aceitas {kpis.aceitas} | % spot {kpis.spot} | % no show {kpis.noShow} | tempo médio {kpis.tempoAceite}</div>
    <h4>Ranking scorecard mock</h4>
    <div>1) Trans Ativa 92 pts | 2) Trans Suspensa 70 pts | 3) Trans Inativa 60 pts</div>
    <small>Marcos configurados: {Object.values(configuracoes.horarios).join(', ')}</small>
  </div>;
};
