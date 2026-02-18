import { useCargoStore } from '../store/cargoStore';
import { isAfter } from '../utils/time';

export const GplogAceitesPage = () => {
  const { cargas, horaAtual, configuracoes, updateStatus } = useCargoStore();
  const aceitos = cargas.filter(c => c.status === 'agendado');
  const pendentes = cargas.filter(c => ['em análise', 'em oferta'].includes(c.status));
  const critico = isAfter(horaAtual, configuracoes.horarios.h1530);
  return <div>
    <h2>T-11 Aceites e Pendências</h2>
    {critico && <div style={{ background: '#fee2e2', padding: 8 }}>ALERTA CRÍTICO: pendências após 15:30</div>}
    <h4>Aceitos</h4>
    {aceitos.map(c => <div key={c.id}>{c.codigo}</div>)}
    <h4>Pendentes</h4>
    {pendentes.map(c => <div key={c.id} style={{ color: critico ? 'red' : '#a16207' }}>{c.codigo}
      <button onClick={() => updateStatus(c.id, 'em cotação spot', 'Enviado para cotação spot')}>Enviar p/ spot</button>
      <button onClick={() => updateStatus(c.id, 'devolvida', 'Devolvida ao PCP a partir de pendência')}>Devolver PCP</button>
    </div>)}
  </div>;
};
