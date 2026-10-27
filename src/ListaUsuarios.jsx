import { useEffect, useState } from 'react';

const URL = 'http://localhost:3000/users';

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  async function carregar() {
    const resp = await fetch(URL);
    setUsuarios(await resp.json());
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvar(e) {
    e.preventDefault();
    if (editandoId) {
      await fetch(`${URL}/${editandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome }),
      });
    } else {
      await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome }),
      });
    }
    setNome('');
    setEditandoId(null);
    carregar();
  }

  async function excluir(id) {
    await fetch(`${URL}/${id}`, { method: 'DELETE' });
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
