import { useState } from "react";

export const useLoadingDisclosure = (initialState: boolean = false) => {
  const [isLoading, setIsLoading] = useState<boolean>(initialState);

  const loading = () => setIsLoading(true);
  const complete = () => setIsLoading(false);

  return { isLoading, loading, complete };
};
