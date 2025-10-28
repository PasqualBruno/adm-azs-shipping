import { useCallback, useRef, useState } from "react";
import type { IShippingCreateDTO } from "../../../interfaces/DTOs/DTOs";
import type { IPaginate } from "../../../interfaces/interfaces";
import type { IShippingResponse } from "../../../interfaces/Responses/Responses";
import ShippingRepository from "../../../repositories/ShippingRepository";

interface FetchParams {
  page?: number;
  limit?: number;
  search?: string;
}

const useShipping = () => {
  const [shippings, setShippings] = useState<IPaginate<IShippingResponse>>({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
  });
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  const lastParams = useRef<FetchParams>({ page: 1, limit: 10, search: "" });

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchShipping = useCallback(async (params?: FetchParams) => {
    const finalParams = {
      page: params?.page ?? lastParams.current.page,
      limit: params?.limit ?? lastParams.current.limit,
      search: params?.search ?? lastParams.current.search,
    };

    lastParams.current = finalParams;

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    return new Promise<IPaginate<IShippingResponse>>((resolve, reject) => {
      debounceTimeout.current = setTimeout(async () => {
        setLoadingFetch(true);
        try {
          const response = await ShippingRepository.fetchShipping(finalParams);
          setShippings(response.data);
          resolve(response.data);
        } catch (err: any) {
          console.error("Erro ao buscar frete:", err);
          reject(err);
        } finally {
          setLoadingFetch(false);
        }
      }, 300);
    });
  }, []);

  const create = async (data: Partial<IShippingCreateDTO>) => {
    setLoadingAction(true);
    try {
      const response = await ShippingRepository.create(data);

      await fetchShipping();
      return response;
    } catch (err: any) {
      console.error("Erro ao criar frete:", err);
      throw err;
    } finally {
      setLoadingAction(false);
    }
  };

  const edit = async (id: string, data: Partial<IShippingCreateDTO>) => {
    setLoadingAction(true);
    try {
      const response = await ShippingRepository.update(id, data);
      await fetchShipping();
      return response;
    } catch (err: any) {
      console.error("Erro ao editar frete:", err);
      throw err;
    } finally {
      setLoadingAction(false);
    }
  };

  const remove = async (id: string) => {
    setLoadingAction(true);
    try {
      await ShippingRepository.remove(id);
      await fetchShipping();
    } catch (err: any) {
      console.error("Erro ao remover frete:", err);
      throw err;
    } finally {
      setLoadingAction(false);
    }
  };

  const refresh = async () => {
    await fetchShipping();
  };

  return {
    shippings,
    loadingFetch,
    loadingAction,
    fetchShipping,
    create,
    edit,
    remove,
    refresh,
  };
};

export default useShipping;
