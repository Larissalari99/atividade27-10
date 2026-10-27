export const BASE_URL = 'http://localhost:3000';

async function requisicao(caminho, opcoes = {}) {
  const resp = await fetch(`${BASE_URL}${caminho}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opcoes,
  });

  if (!resp.ok) {
    throw new Error(`Erro ${resp.status}: ${resp.statusText}`);
  }

  if (resp.status === 204) return null;
  return resp.json();
}

export const apiGet = (caminho) => requisicao(caminho);

export const apiPost = (caminho, dados) =>
  requisicao(caminho, { method: 'POST', body: JSON.stringify(dados) });

export const apiPut = (caminho, dados) =>
  requisicao(caminho, { method: 'PUT', body: JSON.stringify(dados) });

export const apiDelete = (caminho) =>
  requisicao(caminho, { method: 'DELETE' });
