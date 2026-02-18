import { useState } from 'react';
import { useCargoStore } from '../store/cargoStore';
import { isAfter } from '../utils/time';

export const PcpImportacaoPage = () => {
  const { horaAtual, configuracoes } = useCargoStore();
  const [validacaoOk, setValidacaoOk] = useState(false);
  const [historico, setHistorico] = useState<string[]>(['Grade 2024-11-01 importada']);
  return <div>
    <h2>T-05 Importação</h2>
    {isAfter(horaAtual, configuracoes.horarios.h11) && <div style={{ background: '#fee2e2', padding: 8 }}>Atenção: importação após 11:00</div>}
    <p>Upload mock da grade:</p>
    <button onClick={() => setValidacaoOk(true)}>Importar e validar</button>
    <ul>
      <li>Origem: {validacaoOk ? 'OK' : 'Erro'}</li>
      <li>Destino: {validacaoOk ? 'OK' : 'Erro'}</li>
      <li>Peso: {validacaoOk ? 'OK' : 'Erro'}</li>
    </ul>
    <button disabled={!validacaoOk} onClick={() => setHistorico(prev => [`Importação confirmada ${new Date().toLocaleString()}`, ...prev])}>Confirmar importação</button>
    <h4>Histórico</h4>
    {historico.map(h => <div key={h}>{h}</div>)}
  </div>;
};
