export const BASE_URL = 'http://localhost:3000';

export class ApiError extends Error {
  constructor(status, statusText) {
    super(statusText);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function requisicao(caminho, opcoes = {}) {
  const resp = await fetch(`${BASE_URL}${caminho}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opcoes,
  });

  if (!resp.ok) {
    throw new ApiError(resp.status, resp.statusText);
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

export function mensagemDeErro(erro) {
  if (erro instanceof ApiError) {
    if (erro.status === 404) return 'Recurso não encontrado';
    if (erro.status === 500) return 'Erro no servidor';
    return `Erro ${erro.status}`;
  }
  if (erro instanceof TypeError) return 'Falha de rede';
  return 'Erro inesperado';
}
