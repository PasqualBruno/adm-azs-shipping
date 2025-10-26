const TOKEN_KEY = "fretesToken";
export const setToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error("Erro ao salvar o token no localStorage:", error);
  }
};

export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Erro ao ler o token do localStorage:", error);
    return null;
  }
};

export const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error("Erro ao remover o token do localStorage:", error);
  }
};
