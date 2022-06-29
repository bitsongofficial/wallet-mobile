export type Handler<T = any> = (data?: T) => void;

type IHandler = {
  [key: string]: Handler;
};

type List<T extends IHandler> = {
  [key in keyof T]: T[key][];
};

export default class Emitter<Handler extends IHandler> {
  constructor(public handlers = {} as List<Handler>) {}

  on<E extends keyof Handler, H extends Handler[E]>(event: E, fn: H) {
    if (this.handlers[event]) {
      this.handlers[event].push(fn);
    } else {
      this.handlers[event] = [fn];
    }
    return () => {
      this.handlers[event] = this.handlers[event].filter((h) => fn !== h);
    };
  }

  reset() {
    this.handlers = {} as List<Handler>;
  }

  emit<E extends keyof Handler>(event: E, data?: Parameters<Handler[E]>[0]) {
    this.handlers[event]?.map((handler) => handler(data));
  }
}
