import Dexie from 'dexie';

export const FILE_STORE = 'files';
const db = new Dexie('BookDB');
db.version(1).stores({ [FILE_STORE]: '++id' });

db.open();

export default db;
