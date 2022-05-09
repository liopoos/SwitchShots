import db from '../datastore';

function set(table, value) {
  db.read().set(table, value).write();
}

function get(table, filed = '') {
  if (filed) {
    return db.read().get(table).find(filed).value();
  }
  return db.read().get(table).value();
}

export default {
  set,
  get
}