import { u as useActor, c as createActor } from "./backend-CCEFFmVU.js";
import "./index-bpXuEzrw.js";
function useBackend() {
  const { actor, isFetching } = useActor(createActor);
  return { actor, isFetching };
}
export {
  useBackend as u
};
