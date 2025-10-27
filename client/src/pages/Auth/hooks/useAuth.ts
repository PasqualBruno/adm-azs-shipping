import { useCallback, useEffect, useState } from "react";
import type { IUserRegisterDTO } from "../../../interfaces/DTOs/DTOs";
import type { IUSerBasic } from "../../../interfaces/interfaces";
import AuthRepository from "../../../repositories/AuthRepository";
import { getToken, removeToken, setToken } from "../../../utils/tokenStorage";

const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<IUSerBasic | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const checkAuthStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (token) {
        const userData = await AuthRepository.getUser();
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

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  async function register(userData: IUserRegisterDTO) {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthRepository.register(userData);
      return response;
    } catch (err: any) {
      console.error("Erro no registro:", err);
      setError(err.message || "Falha ao registrar.");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function login(userName: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthRepository.login(userName, password);
      await setToken(response.data.token);
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (err: any) {
      console.error("Erro no login:", err);
      setError(err.message || "Falha ao fazer login.");
      setIsAuthenticated(false);
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    setError(null);
    try {
      await AuthRepository.logout();
      await removeToken();
    } catch (err) {
      console.error("Erro na API de logout (ignorado):", err);
    } finally {
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
