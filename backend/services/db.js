import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DB_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'ascendin-db.json');

let db;
try { db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); }
catch(e){ db = { users:{}, accounts:{}, requests:{}, journal:[], txns:[] }; }

export function load(){ return db; }
export function persist(){ fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2)); }