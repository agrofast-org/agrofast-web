import { useState } from "react";
export interface UseLoadingDisclosure {
  isLoading: boolean;
  loading: () => void;
  complete: () => void;
}

export type UseLoadingDisclosureFn = (
  initialState?: boolean
) => UseLoadingDisclosure;

export const useLoadingDisclosure: UseLoadingDisclosureFn = (
  initialState: boolean = false
) => {
  const [isLoading, setIsLoading] = useState<boolean>(initialState);

  const loading = () => setIsLoading(true);
  const complete = () => setIsLoading(false);

  return { isLoading, loading, complete };
};
