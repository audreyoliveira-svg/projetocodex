import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/ui';
import { useCargoStore } from './store/cargoStore';
import { LoginPage } from './pages/LoginPage';
import { AdminTransportadorasPage } from './pages/AdminTransportadorasPage';
import { AdminUsuariosPage } from './pages/AdminUsuariosPage';
import { AdminConfiguracoesPage } from './pages/AdminConfiguracoesPage';
import { PcpImportacaoPage } from './pages/PcpImportacaoPage';
import { PcpCargaManualPage } from './pages/PcpCargaManualPage';
import { GplogPainelPage } from './pages/GplogPainelPage';
import { GplogAceitesPage } from './pages/GplogAceitesPage';
import { TransportadoraOfertasPage } from './pages/TransportadoraOfertasPage';
import { ComprasSpotPage } from './pages/ComprasSpotPage';
import { TorreControlePage } from './pages/TorreControlePage';
import { CargaDetalhePage } from './pages/CargaDetalhePage';

const Guard = ({ allow, children }: { allow: string[]; children: JSX.Element }) => {
  const { sessao } = useCargoStore();
  if (!sessao) return <Navigate to="/login" replace />;
  if (!allow.includes(sessao.perfil)) return <Navigate to="/torre-controle" replace />;
  return children;
};

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/transportadoras" element={<Guard allow={['adm']}><AdminTransportadorasPage /></Guard>} />
        <Route path="/admin/usuarios" element={<Guard allow={['adm']}><AdminUsuariosPage /></Guard>} />
        <Route path="/admin/configuracoes" element={<Guard allow={['adm']}><AdminConfiguracoesPage /></Guard>} />
        <Route path="/pcp/importacao" element={<Guard allow={['pcp', 'adm']}><PcpImportacaoPage /></Guard>} />
        <Route path="/pcp/carga-manual" element={<Guard allow={['pcp', 'adm']}><PcpCargaManualPage /></Guard>} />
        <Route path="/gplog/painel" element={<Guard allow={['gplog', 'adm']}><GplogPainelPage /></Guard>} />
        <Route path="/gplog/aceites" element={<Guard allow={['gplog', 'adm']}><GplogAceitesPage /></Guard>} />
        <Route path="/transportadora/ofertas" element={<Guard allow={['transportadora']}><TransportadoraOfertasPage /></Guard>} />
        <Route path="/compras/spot" element={<Guard allow={['compras', 'adm']}><ComprasSpotPage /></Guard>} />
        <Route path="/torre-controle" element={<Guard allow={['adm', 'pcp', 'gplog', 'transportadora', 'compras']}><TorreControlePage /></Guard>} />
        <Route path="/carga/:id" element={<Guard allow={['adm', 'pcp', 'gplog', 'transportadora', 'compras']}><CargaDetalhePage /></Guard>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AppShell>
  );
}
