import { useCallback, useEffect, useState } from "react";
import type { UserDTO } from "../../../interfaces/DTOs/DTOs"; // Ajuste o caminho se necessário
import AuthRepository from "../../../repositories/AuthRepository"; // Ajuste o caminho se necessário
// Suponha que você tenha um storage seguro para o token (AsyncStorage, SecureStore)
import { getToken, removeToken, setToken } from "../utils/tokenStorage"; // Exemplo

const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(true); // Começa true para a verificação inicial
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // Estado para erros

  // Função para verificar se existe um token ao iniciar o app
  const checkAuthStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (token) {
        // Se temos token, tentamos buscar o usuário (valida o token no backend)
        const userData = await AuthRepository.getUser(); // Assumindo getUser usa o token (via interceptor ou header)
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      // Se getToken falhar ou getUser falhar (token inválido/expirado)
      await removeToken(); // Limpa token inválido
      setIsAuthenticated(false);
      setUser(null);
      console.error("Erro ao verificar status de autenticação:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Executa a verificação inicial quando o hook é montado
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  async function register(userData: UserDTO) {
    setLoading(true);
    setError(null);
    try {
      await AuthRepository.register(userData);
      // Opcional: fazer login automaticamente após o registro?
      // await login(userData.username, userData.password); // Assumindo username/password
    } catch (err: any) {
      console.error("Erro no registro:", err);
      setError(err.message || "Falha ao registrar.");
      throw err; // Relança para o componente, se necessário
    } finally {
      setLoading(false);
    }
  }

  async function login(userName: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthRepository.login(userName, password);
      // Supondo que a resposta tenha { token, user }
      await setToken(response.token); // Salva o token
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (err: any) {
      console.error("Erro no login:", err);
      setError(err.message || "Falha ao fazer login.");
      setIsAuthenticated(false);
      setUser(null);
      throw err; // Relança para o componente, se necessário
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true); // Pode adicionar loading aqui também
    setError(null);
    try {
      // Tenta chamar a API de logout (opcional, depende do seu backend)
      // await AuthRepository.logout();
    } catch (err) {
      console.error("Erro na API de logout (ignorado):", err);
    } finally {
      // Ação principal é limpar o estado local e o token
      await removeToken();
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  }

  return {
    // Estado
    loading,
    user,
    isAuthenticated,
    error,
    // Ações
    register,
    login,
    logout,
    checkAuthStatus, // Pode ser útil retornar para um "refresh" manual
  };
};

export default useAuth;
