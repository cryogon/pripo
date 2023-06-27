import mitt from "../libs/mitt";

const emitter = mitt();

export function useEmitter() {
  return emitter;
}
