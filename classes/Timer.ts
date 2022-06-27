import { makeAutoObservable } from "mobx";
import { Emitter, Handler } from "utils";

export default class Timer {
  token: number | null = null;
  time: number | null = null;
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  emmiter = new Emitter<TimerHandlers>();

  stop() {
    this.token && clearInterval(this.token);
    this.token = null;
    this.emmiter.emit("stop");
  }

  setTime() {
    if (this.time === null) return (this.time = 30);
    if (this.time !== 0) return (this.time = this.time - 1);
    this.stop();
  }

  start(sec = 30) {
    this.emmiter.emit("start");
    this.token = setInterval(() => this.setTime(), 1000);
  }
}

type TimerHandlers = {
  start?: Handler;
  stop?: Handler;
};
