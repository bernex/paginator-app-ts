
import { action, computed, IObservableArray, observable } from "mobx"

type Items = IObservableArray<string>;

class Menu {
  @observable public selected: number = 0;
  @observable public items: Items = observable.array<string>([]);

  constructor(items: string[]) {
    this.items.replace(items);
    this.select(0);
  }

  @computed get selectedItem() {
    return this.items[this.selected];
  }

  @action.bound public select(index: number | string) {
    if(typeof index !== 'number') {
      index = this.items.indexOf(index);
    }
    this.selected = index;
  }

  @action.bound public next() {
    let index = this.selected + 1;
    if(index >= this.items.length) {
      index = 0;
    }

    this.select(index);
  }

  @action.bound public prev() {
    let index = this.selected - 1;
    if(index < 0) {
      index = this.items.length - 1;
    }

    this.select(index);
  }
}

export default Menu;
