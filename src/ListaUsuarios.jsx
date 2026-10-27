import { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from './api';

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  async function carregar() {
    setUsuarios(await apiGet('/users'));
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvar(e) {
    e.preventDefault();
    if (editandoId) {
      await apiPut(`/users/${editandoId}`, { nome });
    } else {
      await apiPost('/users', { nome });
    }
    setNome('');
    setEditandoId(null);
    carregar();
  }

  async function excluir(id) {
    await apiDelete(`/users/${id}`);
    carregar();
  }

  function editar(u) {
    setEditandoId(u.id);
    setNome(u.nome);
  }

  return (
    <>
      <form onSubmit={salvar}>
        <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" required />
        <button type="submit">{editandoId ? 'Salvar' : 'Criar'}</button>
      </form>
      <ul>
        {usuarios.map((u) => (
          <li key={u.id}>
            {u.nome} <button onClick={() => editar(u)}>Editar</button>{' '}
            <button onClick={() => excluir(u.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </>
  );
}
