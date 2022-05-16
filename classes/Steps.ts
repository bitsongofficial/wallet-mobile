import { makeAutoObservable } from "mobx";

export default class Steps<T extends string = any> {
  active = 0;

  constructor(public titles: T[]) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get title() {
    return this.titles[this.active];
  }

  private setActive(index: number) {
    this.active = index;
  }

  next() {
    if (this.active < this.titles.length - 1) {
      this.setActive(this.active + 1);
    }
  }

  prev() {
    if (this.active > 0) {
      this.setActive(this.active - 1);
    }
  }
}
