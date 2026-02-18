import { ReactNode, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCargoStore } from '../store/cargoStore';
import { statusColor } from '../utils/format';
import { StatusCarga } from '../types';

export const StatusBadge = ({ status }: { status: StatusCarga }) => (
  <span style={{ background: statusColor[status], color: '#fff', borderRadius: 10, padding: '2px 8px', fontSize: 12 }}>{status}</span>
);

export const ToastHost = ({ message }: { message: string | null }) => message ? (
  <div style={{ position: 'fixed', right: 16, top: 16, background: '#111827', color: '#fff', padding: 12, borderRadius: 8 }}>{message}</div>
) : null;

export const Modal = ({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) => (
  <div style={{ position: 'fixed', inset: 0, background: '#0008', display: 'grid', placeItems: 'center' }}>
    <div style={{ background: '#fff', padding: 16, width: 460, maxWidth: '90%' }}>
      <h3>{title}</h3>
      {children}
      <button onClick={onClose}>Fechar</button>
    </div>
  </div>
);

export const Drawer = ({ open, title, children, onClose }: { open: boolean; title: string; children: ReactNode; onClose: () => void }) => open ? (
  <div style={{ position: 'fixed', top: 0, right: 0, width: 420, height: '100vh', background: '#fff', borderLeft: '1px solid #ddd', padding: 16, overflow: 'auto' }}>
    <h3>{title}</h3>
    {children}
    <button onClick={onClose}>Fechar</button>
  </div>
) : null;

const navByPerfil: Record<string, { to: string; label: string }[]> = {
  adm: [
    { to: '/admin/transportadoras', label: 'Transportadoras' },
    { to: '/admin/usuarios', label: 'Usuários' },
    { to: '/admin/configuracoes', label: 'Configurações' },
    { to: '/gplog/aceites', label: 'Aceites/Pendências' },
    { to: '/torre-controle', label: 'Torre de Controle' }
  ],
  pcp: [
    { to: '/pcp/importacao', label: 'Importação' },
    { to: '/pcp/carga-manual', label: 'Carga Manual' },
    { to: '/torre-controle', label: 'Torre de Controle' }
  ],
  gplog: [
    { to: '/gplog/painel', label: 'Painel GPL' },
    { to: '/gplog/aceites', label: 'Aceites/Pendências' },
    { to: '/torre-controle', label: 'Torre de Controle' }
  ],
  transportadora: [
    { to: '/transportadora/ofertas', label: 'Ofertas' },
    { to: '/torre-controle', label: 'Torre de Controle' }
  ],
  compras: [
    { to: '/compras/spot', label: 'Spot' },
    { to: '/torre-controle', label: 'Torre de Controle' }
  ]
};

export const AppShell = ({ children }: { children: ReactNode }) => {
  const { sessao, logout, horaAtual, setHoraAtual, alerts } = useCargoStore();
  const navigate = useNavigate();
  const [openAlerts, setOpenAlerts] = useState(false);
  if (!sessao) return <>{children}</>;
  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: 12, borderBottom: '1px solid #ddd' }}>
        <strong>Sistema de Gestão de Fretes</strong>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span>Hora simulada:</span>
          <input type="time" value={horaAtual} onChange={e => setHoraAtual(e.target.value)} />
          <button onClick={() => setOpenAlerts(v => !v)}>Alertas ({alerts.length})</button>
          <button onClick={() => { logout(); navigate('/login'); }}>Logout</button>
        </div>
      </header>
      {openAlerts && <div style={{ background: '#fef3c7', padding: 8 }}>{alerts.map(a => <div key={a}>{a}</div>)}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: 'calc(100vh - 56px)' }}>
        <aside style={{ borderRight: '1px solid #ddd', padding: 12 }}>
          <div><b>{sessao.nome}</b> ({sessao.perfil})</div>
          {(navByPerfil[sessao.perfil] || []).map(item => <div key={item.to}><Link to={item.to}>{item.label}</Link></div>)}
        </aside>
        <main style={{ padding: 16 }}>{children}</main>
      </div>
    </div>
  );
};
