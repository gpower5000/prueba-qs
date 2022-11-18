import store from "../store";

export function disptach(action, payload) {
  store.disptach(action, payload);
}

export function getStore() {
  console.log('store', store);
}