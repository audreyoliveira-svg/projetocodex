import { useMemo, useState } from 'react';
import { Drawer } from '../components/ui';
import { useCargoStore } from '../store/cargoStore';
import { Usuario } from '../types';

export const AdminUsuariosPage = () => {
  const { usuarios, upsertUsuario } = useCargoStore();
  const [filtro, setFiltro] = useState('');
  const [selected, setSelected] = useState<Usuario | null>(null);
  const rows = useMemo(() => usuarios.filter(u => !filtro || u.perfil === filtro), [usuarios, filtro]);
  return <div>
    <h2>T-03 Usuários</h2>
    <select value={filtro} onChange={e => setFiltro(e.target.value)}><option value="">Perfil</option><option>adm</option><option>pcp</option><option>gplog</option><option>transportadora</option><option>compras</option></select>
    <button onClick={() => setSelected({ id: '', nome: '', login: '', perfil: 'pcp', status: 'ativo' })}>+ Novo usuário</button>
    {rows.map(u => <div key={u.id}>{u.nome} ({u.perfil}) <button onClick={() => setSelected(u)}>Editar</button></div>)}
    <Drawer open={!!selected} title="Usuário" onClose={() => setSelected(null)}>
      {selected && <div>
        <input value={selected.nome} placeholder="Nome" onChange={e => setSelected({ ...selected, nome: e.target.value })} />
        <input value={selected.login} placeholder="Login" onChange={e => setSelected({ ...selected, login: e.target.value })} />
        <button disabled={!selected.nome || !selected.login} onClick={() => { upsertUsuario({ ...selected, id: selected.id || crypto.randomUUID() }); setSelected(null); }}>Salvar</button>
      </div>}
    </Drawer>
  </div>;
};
