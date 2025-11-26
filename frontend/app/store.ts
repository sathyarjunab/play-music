// src/stores/SearchStore.ts
import { makeAutoObservable } from "mobx";

class Store {
  videoId = "";
  title = "";

  constructor() {
    makeAutoObservable(this);
  }

  setQuery(id: string, title: string) {
    this.videoId = id;
    this.title = title;
  }
}

export const store = new Store();
