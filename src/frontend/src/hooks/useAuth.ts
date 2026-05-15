import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const {
    login,
    clear,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    loginStatus,
    identity,
  } = useInternetIdentity();

  const queryClient = useQueryClient();

  const logout = () => {
    clear();
    queryClient.clear();
  };

  const principal = identity?.getPrincipal();

  return {
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    loginStatus,
    principal,
    identity,
    login,
    logout,
  };
}
