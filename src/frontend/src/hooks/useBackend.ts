import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";

export function useBackend() {
  const { actor, isFetching } = useActor(createActor);
  return { actor, isFetching };
}
