export type Perfil = 'adm' | 'pcp' | 'gplog' | 'transportadora' | 'compras';

export type StatusCarga =
  | 'planejado'
  | 'em análise'
  | 'em oferta'
  | 'agendado'
  | 'em carregamento'
  | 'em trânsito'
  | 'entregue'
  | 'encerrada'
  | 'no show'
  | 'em cotação spot'
  | 'devolvida';

export interface LogAuditoria {
  id: string;
  hora: string;
  usuario: string;
  perfil: Perfil;
  acao: string;
}

export interface Carga {
  id: string;
  codigo: string;
  origem: string;
  destino: string;
  rota: string;
  dataEntrega: string;
  peso: number;
  paletes: number;
  status: StatusCarga;
  urgente: boolean;
  aceitaPor?: string;
  dadosAceite?: {
    placa: string;
    motorista: string;
    cpf: string;
    tipoCaminhao: string;
    capacidade: string;
  };
  pendenteAceite: boolean;
  log: LogAuditoria[];
}

export interface Transportadora {
  id: string;
  nome: string;
  cnpj: string;
  tipo: 'interno' | 'externo';
  status: 'ativa' | 'suspensa' | 'inativa';
  rotasHomologadas: string[];
}

export interface Usuario {
  id: string;
  nome: string;
  login: string;
  perfil: Perfil;
  status: 'ativo' | 'inativo';
}

export interface Configuracoes {
  horarios: {
    h11: string;
    h1130: string;
    h12: string;
    h15: string;
    h1530: string;
  };
  pesosRanking: {
    custo: number;
    prazo: number;
    ocorrencias: number;
  };
  penalizacoes: {
    churn: number;
    noShow: number;
    atraso: number;
  };
  historicoAlteracoes: string[];
}
