import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Carga, Configuracoes, Perfil, StatusCarga, Transportadora, Usuario } from '../types';
import { isAfter } from '../utils/time';

interface Sessao {
  nome: string;
  perfil: Perfil;
  transportadoraId?: string;
}

interface CargoStoreContextType {
  cargas: Carga[];
  transportadoras: Transportadora[];
  usuarios: Usuario[];
  configuracoes: Configuracoes;
  sessao: Sessao | null;
  horaAtual: string;
  alerts: string[];
  login: (perfil: Perfil) => void;
  logout: () => void;
  setHoraAtual: (hora: string) => void;
  updateStatus: (id: string, status: StatusCarga, acao: string) => void;
  appendLog: (id: string, acao: string) => void;
  createCarga: (partial: Partial<Carga>) => void;
  upsertTransportadora: (t: Transportadora) => void;
  upsertUsuario: (u: Usuario) => void;
  updateConfiguracoes: (config: Configuracoes) => void;
  simulateVersionUpdate: (id: string) => void;
}

const initialConfig: Configuracoes = {
  horarios: { h11: '11:00', h1130: '11:30', h12: '12:00', h15: '15:00', h1530: '15:30' },
  pesosRanking: { custo: 40, prazo: 40, ocorrencias: 20 },
  penalizacoes: { churn: 10, noShow: 20, atraso: 8 },
  historicoAlteracoes: ['Configuração inicial carregada']
};

const makeLog = (acao: string, hora: string, usuario = 'Sistema', perfil: Perfil = 'adm') => ({
  id: crypto.randomUUID(), hora, usuario, perfil, acao
});

const makeCarga = (id: string, status: StatusCarga, rota: string, urgente = false, pendenteAceite = false): Carga => ({
  id,
  codigo: `CG-${id}`,
  origem: 'CD São Paulo',
  destino: rota.includes('RJ') ? 'Rio de Janeiro' : rota.includes('MG') ? 'Belo Horizonte' : 'Campinas',
  rota,
  dataEntrega: urgente ? new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 10) : new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString().slice(0, 10),
  peso: 12500,
  paletes: 18,
  status,
  urgente,
  pendenteAceite,
  log: [
    makeLog('Carga criada no planejamento', '08:00', 'PCP Maria', 'pcp'),
    makeLog('Carga validada no sistema', '08:15', 'Sistema', 'adm'),
    makeLog('Oferta preparada para análise', '10:30', 'PCP Maria', 'pcp'),
    makeLog(`Status atualizado para ${status}`, '10:45', 'Sistema', 'adm'),
    makeLog('Registro auditável confirmado', '10:46', 'Sistema', 'adm')
  ]
});

const initialCargas: Carga[] = [
  makeCarga('1', 'em análise', 'SP-RJ', true, true),
  makeCarga('2', 'em análise', 'SP-MG', false, true),
  makeCarga('3', 'em análise', 'SP-CPS', false, true),
  makeCarga('4', 'agendado', 'SP-RJ'),
  makeCarga('5', 'em oferta', 'SP-MG', false, true),
  makeCarga('6', 'em trânsito', 'SP-RJ'),
  makeCarga('7', 'entregue', 'SP-CPS'),
  makeCarga('8', 'encerrada', 'SP-RJ'),
  makeCarga('9', 'no show', 'SP-MG', false, true),
  makeCarga('10', 'em cotação spot', 'SP-RJ', false, true)
];

const initialTransportadoras: Transportadora[] = [
  { id: 'tr1', nome: 'Trans Ativa', cnpj: '00.000.000/0001-00', tipo: 'externo', status: 'ativa', rotasHomologadas: ['SP-RJ', 'SP-MG'] },
  { id: 'tr2', nome: 'Trans Suspensa', cnpj: '11.111.111/0001-11', tipo: 'externo', status: 'suspensa', rotasHomologadas: ['SP-RJ'] },
  { id: 'tr3', nome: 'Trans Inativa', cnpj: '22.222.222/0001-22', tipo: 'interno', status: 'inativa', rotasHomologadas: ['SP-CPS'] }
];

const initialUsuarios: Usuario[] = [
  { id: 'u1', nome: 'Ana ADM', login: 'adm', perfil: 'adm', status: 'ativo' },
  { id: 'u2', nome: 'Paulo PCP', login: 'pcp', perfil: 'pcp', status: 'ativo' },
  { id: 'u3', nome: 'Gi GPL', login: 'gplog', perfil: 'gplog', status: 'ativo' },
  { id: 'u4', nome: 'Tânia Transportadora', login: 'transportadora', perfil: 'transportadora', status: 'ativo' },
  { id: 'u5', nome: 'Caio Compras', login: 'compras', perfil: 'compras', status: 'ativo' }
];

const CargoStoreContext = createContext<CargoStoreContextType | undefined>(undefined);

export const CargoStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [cargas, setCargas] = useState<Carga[]>(() => JSON.parse(localStorage.getItem('cargas') || 'null') || initialCargas);
  const [transportadoras, setTransportadoras] = useState<Transportadora[]>(initialTransportadoras);
  const [usuarios, setUsuarios] = useState<Usuario[]>(initialUsuarios);
  const [configuracoes, setConfiguracoes] = useState<Configuracoes>(initialConfig);
  const [sessao, setSessao] = useState<Sessao | null>(() => JSON.parse(localStorage.getItem('sessao') || 'null'));
  const [horaAtual, setHoraAtual] = useState<string>(() => localStorage.getItem('horaAtual') || '15:30');

  useEffect(() => { localStorage.setItem('cargas', JSON.stringify(cargas)); }, [cargas]);
  useEffect(() => { localStorage.setItem('sessao', JSON.stringify(sessao)); }, [sessao]);
  useEffect(() => { localStorage.setItem('horaAtual', horaAtual); }, [horaAtual]);

  useEffect(() => {
    if (isAfter(horaAtual, configuracoes.horarios.h12)) {
      setCargas(prev => prev.map(c => c.status === 'em análise' && !c.urgente ? { ...c, status: 'em oferta' } : c));
    }
  }, [horaAtual, configuracoes.horarios.h12]);

  const alerts = useMemo(() => {
    const semAceite = cargas.filter(c => ['em análise', 'em oferta'].includes(c.status) && c.pendenteAceite).length;
    const critical = isAfter(horaAtual, configuracoes.horarios.h1530) ? [`CRÍTICO: ${semAceite} cargas sem aceite após 15:30`] : [];
    const urgentes = cargas.filter(c => c.urgente && ['em análise', 'em oferta'].includes(c.status)).length;
    return [...critical, `${urgentes} carga(s) urgente(s) em prioridade`];
  }, [cargas, horaAtual, configuracoes.horarios.h1530]);

  const appendLog = (id: string, acao: string) => {
    if (!sessao) return;
    setCargas(prev => prev.map(c => c.id === id ? { ...c, log: [...c.log, makeLog(acao, horaAtual, sessao.nome, sessao.perfil)] } : c));
  };

  const updateStatus = (id: string, status: StatusCarga, acao: string) => {
    setCargas(prev => prev.map(c => c.id === id ? { ...c, status, pendenteAceite: !['agendado', 'encerrada', 'entregue'].includes(status) } : c));
    appendLog(id, acao);
  };

  const createCarga = (partial: Partial<Carga>) => {
    const id = String(Date.now());
    const nova: Carga = {
      id,
      codigo: partial.codigo || `CG-${id.slice(-4)}`,
      origem: partial.origem || 'Origem manual',
      destino: partial.destino || 'Destino manual',
      rota: partial.rota || 'SP-RJ',
      dataEntrega: partial.dataEntrega || new Date().toISOString().slice(0, 10),
      peso: partial.peso || 0,
      paletes: partial.paletes || 0,
      status: 'planejado',
      urgente: Boolean(partial.urgente),
      pendenteAceite: true,
      log: [makeLog('Carga criada manualmente', horaAtual, sessao?.nome || 'PCP', sessao?.perfil || 'pcp')]
    };
    setCargas(prev => [nova, ...prev]);
  };

  const login = (perfil: Perfil) => {
    const map: Record<Perfil, Sessao> = {
      adm: { nome: 'Ana ADM', perfil: 'adm' },
      pcp: { nome: 'Paulo PCP', perfil: 'pcp' },
      gplog: { nome: 'Gi GPL', perfil: 'gplog' },
      transportadora: { nome: 'Trans Ativa', perfil: 'transportadora', transportadoraId: 'tr1' },
      compras: { nome: 'Caio Compras', perfil: 'compras' }
    };
    setSessao(map[perfil]);
  };

  const logout = () => setSessao(null);

  const updateConfiguracoes = (config: Configuracoes) => {
    setConfiguracoes(config);
  };

  const simulateVersionUpdate = (id: string) => {
    setCargas(prev => prev.map(c => c.id === id ? { ...c, pendenteAceite: true, aceitaPor: undefined, dadosAceite: undefined, status: 'em oferta' } : c));
    appendLog(id, 'Versão atualizada em campo crítico, aceite cancelado e novo aceite exigido');
  };

  return (
    <CargoStoreContext.Provider
      value={{
        cargas,
        transportadoras,
        usuarios,
        configuracoes,
        sessao,
        horaAtual,
        alerts,
        login,
        logout,
        setHoraAtual,
        updateStatus,
        appendLog,
        createCarga,
        upsertTransportadora: (t) => setTransportadoras(prev => prev.some(x => x.id === t.id) ? prev.map(x => x.id === t.id ? t : x) : [...prev, t]),
        upsertUsuario: (u) => setUsuarios(prev => prev.some(x => x.id === u.id) ? prev.map(x => x.id === u.id ? u : x) : [...prev, u]),
        updateConfiguracoes,
        simulateVersionUpdate
      }}
    >
      {children}
    </CargoStoreContext.Provider>
  );
};

export const useCargoStore = () => {
  const ctx = useContext(CargoStoreContext);
  if (!ctx) throw new Error('useCargoStore fora do provider');
  return ctx;
};
