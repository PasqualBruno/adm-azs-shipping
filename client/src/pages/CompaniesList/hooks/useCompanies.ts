import { useState } from "react";
import type { ICompany } from "../../../interfaces/interfaces";
import CompaniesRepository from "../../../repositories/CompaniesRepository";

const useCompanies = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companies, setCompanies] = useState<ICompany[]>([]);

  async function fetchCompanies() {
    setLoading(true);
    setError(null);
    try {
      const response = await CompaniesRepository.getCompanies();
      setCompanies(response.data);
      return response;
    } catch (err: any) {
      console.error("Erro no registro:", err);
      setError(err.message || "Falha ao registrar.");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function create(data: ICompany) {
    setLoading(true);
    setError(null);
    try {
      const response = await CompaniesRepository.create(data);
      return response;
    } catch (err: any) {
      console.error("Erro no registro:", err);
      setError(err.message || "Falha ao registrar.");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function update(id: string, data: ICompany) {
    setLoading(true);
    setError(null);
    try {
      const response = await CompaniesRepository.updateCompany(id, data);
      return response;
    } catch (err: any) {
      console.error("Erro no registro:", err);
      setError(err.message || "Falha ao registrar.");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    setLoading(true);
    setError(null);
    try {
      const response = await CompaniesRepository.deleteCompany(id);
      return response;
    } catch (err: any) {
      console.error("Erro no registro:", err);
      setError(err.message || "Falha ao registrar.");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { loading, create, update, remove, error, companies, fetchCompanies };
};

export default useCompanies;
