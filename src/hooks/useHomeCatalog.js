import { useCallback, useEffect, useState } from 'react';
import { publicCatalogApi } from '../services/publicCatalog';

const getErrorMessage = (result) => {
  if (result.status !== 'rejected') return null;
  return (
    result.reason?.response?.data?.message ||
    'No pudimos cargar la información en este momento.'
  );
};

export const useHomeCatalog = ({ servicesLimit = 6, professionalsLimit = 4 } = {}) => {
  const [state, setState] = useState({
    services: [],
    professionals: [],
    loading: true,
    servicesError: null,
    professionalsError: null,
  });

  const fetchCatalog = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      loading: true,
      servicesError: null,
      professionalsError: null,
    }));

    const [servicesResult, professionalsResult] = await Promise.allSettled([
      publicCatalogApi.services({ limit: servicesLimit }),
      publicCatalogApi.professionals({ limit: professionalsLimit }),
    ]);

    setState({
      services:
        servicesResult.status === 'fulfilled'
          ? servicesResult.value.data.data.services || []
          : [],
      professionals:
        professionalsResult.status === 'fulfilled'
          ? professionalsResult.value.data.data.professionals || []
          : [],
      loading: false,
      servicesError: getErrorMessage(servicesResult),
      professionalsError: getErrorMessage(professionalsResult),
    });
  }, [servicesLimit, professionalsLimit]);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  return { ...state, refetch: fetchCatalog };
};
