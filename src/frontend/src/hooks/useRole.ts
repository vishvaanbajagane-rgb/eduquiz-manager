import { createActor } from "@/backend";
import type { UserRoleType } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export function useRole(): UserRoleType {
  const { isAuthenticated } = useAuth();
  const { actor, isFetching } = useActor(createActor);

  const { data: isAdmin, isLoading } = useQuery<boolean>({
    queryKey: ["callerRole"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 60_000,
  });

  if (!isAuthenticated) return "unauthenticated";
  if (isFetching || isLoading || isAdmin === undefined) return "loading";
  return isAdmin ? "admin" : "student";
}
