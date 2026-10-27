import { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPut, apiDelete, mensagemDeErro } from './api';

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [erro, setErro] = useState(null);

  async function carregar(signal) {
    try {
      setUsuarios(await apiGet('/users', { signal }));
      setErro(null);
    } catch (e) {
      if (e.name === 'AbortError') return; // cancelamento não é erro para o usuário
      setErro(mensagemDeErro(e));
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    carregar(controller.signal);
    return () => controller.abort();
  }, []);

  async function salvar(e) {
    e.preventDefault();
    try {
      if (editandoId) {
        await apiPut(`/users/${editandoId}`, { nome });
      } else {
        await apiPost('/users', { nome });
      }
      setNome('');
      setEditandoId(null);
      carregar();
    } catch (err) {
      setErro(mensagemDeErro(err));
    }
  }

  async function excluir(id) {
    try {
      await apiDelete(`/users/${id}`);
      carregar();
    } catch (err) {
      setErro(mensagemDeErro(err));
    }
  }

  function editar(u) {
    setEditandoId(u.id);
    setNome(u.nome);
  }

  return (
    <>
      {erro && <p role="alert">{erro}</p>}
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
