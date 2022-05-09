import db from '../../utils/dbtools';
import tables from '../tables';

const table = tables.game;

function getGame(id) {
  return db.get(table + '.list', {id: id});
}

function getVersion() {
  return db.get(table + '.version');
}

function getGames() {
  return db.get(table);
}

function setGame(data) {
  return db.set(table, data);
}

export default {
  table,
  setGame,
  getGame,
  getGames,
  getVersion
}

