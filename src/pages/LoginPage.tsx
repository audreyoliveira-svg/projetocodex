import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Perfil } from '../types';
import { useCargoStore } from '../store/cargoStore';

export const LoginPage = () => {
  const { login, sessao } = useCargoStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessao) return;
    const routes: Record<Perfil, string> = {
      adm: '/admin/transportadoras',
      pcp: '/pcp/importacao',
      gplog: '/gplog/painel',
      transportadora: '/transportadora/ofertas',
      compras: '/compras/spot'
    };
    navigate(routes[sessao.perfil]);
  }, [sessao, navigate]);

  return (
    <div style={{ maxWidth: 420, margin: '60px auto' }}>
      <h2>T-01 Login</h2>
      <input placeholder="login" style={{ width: '100%', marginBottom: 12 }} />
      {(['adm', 'pcp', 'gplog', 'transportadora', 'compras'] as Perfil[]).map(p => (
        <button key={p} onClick={() => login(p)} style={{ marginRight: 8, marginBottom: 8 }}>Entrar como {p}</button>
      ))}
    </div>
  );
};
