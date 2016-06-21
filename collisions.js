import { Record as record, List as list } from 'immutable';

const CollisionsRecord = record({
  items: list([]),
});

export default class Collisions extends CollisionsRecord {
  constructor({ items }) {
    super({ items: list(items) });
  }

  add(item) {
    return this
      .update('items', (items) => items.concat(item));
  }

  remove(item) {
    return this
      .update('items', (items) => items.filter((i) => i === item));
  }

  detect(item) {
    return this
      .items
      .some((i) => item.intersects(i));
  }
}
