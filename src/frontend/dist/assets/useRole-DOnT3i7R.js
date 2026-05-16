import { u as useAuth, a as useActor, b as useQuery, c as createActor } from "./backend-Bub9mio5.js";
import "./index-Hh1gENll.js";
function useRole() {
  const { isAuthenticated } = useAuth();
  const { actor, isFetching } = useActor(createActor);
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["callerRole"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 6e4
  });
  if (!isAuthenticated) return "unauthenticated";
  if (isFetching || isLoading || isAdmin === void 0) return "loading";
  return isAdmin ? "admin" : "student";
}
export {
  useRole as u
};
