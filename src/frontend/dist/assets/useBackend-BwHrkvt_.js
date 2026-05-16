import { u as useActor, c as createActor } from "./backend-DmO1ws7H.js";
import "./index-wtDjB40g.js";
function useBackend() {
  const { actor, isFetching } = useActor(createActor);
  return { actor, isFetching };
}
export {
  useBackend as u
};
