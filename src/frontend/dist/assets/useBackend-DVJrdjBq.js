import { u as useActor, c as createActor } from "./backend-DEykqYLI.js";
import "./index-DcBYUGDn.js";
function useBackend() {
  const { actor, isFetching } = useActor(createActor);
  return { actor, isFetching };
}
export {
  useBackend as u
};
