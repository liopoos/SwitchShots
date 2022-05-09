import db from '../../utils/dbtools';
import tables from '../tables';
import store from '../../store/index';

const table = tables.setting;

function getSetting() {
  return db.get(table);
}

function setSetting(data) {
  store.dispatch('setSetting', data).then(() => {
    return db.set(table, data);
  });
}

export default {
  table,
  getSetting,
  setSetting
}
