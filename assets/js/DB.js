/**
 * https://www.digitalocean.com/community/tools/minify
 * https://javascript.info/indexeddb
 **/

const DBNAME  = 'quickfacts';
const TABLEU  = 'update';
const TABLEV  = 'values';
const TABLEG  = 'geos';
const VERSION = 1;
const DBStatus = 'DBStatusUpdate';
const DBProgress = 'DBProgressUpdate';

let DB = {
  initTime: new Date().getTime(),
  statusEvent: DBStatus,
  progressEvent: DBProgress,
  valuesTable: TABLEV,
  geosTable: TABLEG,
  connection: null,
  init: function() {
    return new Promise(function(resolve, reject) {
      let request = indexedDB.open(DBNAME, VERSION);

      request.onupgradeneeded = (e) => {
        console.log('DB request.onupgradeneeded');
        let db = e.target.result;

        // Version 1 is the first version of the database.
        if (e.oldVersion < 1) {
          db.createObjectStore(TABLEU, {keyPath: 'path'}).createIndex('unixtime', 'unixtime');
          db.createObjectStore(TABLEV, {keyPath: 'geoid'}).createIndex('data', 'data');
          db.createObjectStore(TABLEG, {keyPath: 'geoid'}).createIndex('data', 'data');
        }
      };
      request.onerror = (e) => {
        console.error(`Database error: ${e.target.errorCode} - ${e.target.error}`);
        reject({
          code:  e.target.errorCode,
          error: e.target.error
        });
      };
      request.onsuccess = function(e) {
        console.log('DB request.onsuccess');
        let db = e.target.result;

        db.onversionchange = () => {
          db.close();
          alert('Application has been updated, please reload the page.');
        };

        DB.connection = db;
        resolve(db);
      };
    });
  },
  tableCount: ( table ) => {
    return new Promise(function(resolve, reject) {
      const countReq = DB.connection.transaction(table, 'readonly').objectStore(table).count();

      countReq.onsuccess = (e) => {
        resolve(e.currentTarget.result);
      };
      countReq.onerror = (e) => {
        reject(e.currentTarget.result);
      };
    });
  },
  storeData: function ( table, path, data) {
    return new Promise(function(resolve, reject) {
      console.log(`[DB] loading ${table}`);

      try {
        const tx  = DB.connection.transaction([table, TABLEU], 'readwrite');
        const myTableStore = tx.objectStore(table);
        const updateStore  = tx.objectStore(TABLEU);

        let last = 0;

        // https://web.dev/articles/indexeddb
        // https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/put
        data.forEach((v, progress)=>{
          const put = myTableStore.put(v);

          let curr = Math.round((progress / data.length) * 100);
          if ( curr !== last ) {
            window.dispatchEvent(new CustomEvent(DBProgress, {detail: curr}));
            last = curr;
          }
        });

        //window.dispatchEvent(new CustomEvent(DBProgress, {detail:0}));
        updateStore.put({
          path:     path,
          unixtime: Math.floor(Date.now()/1000)
        });

        tx.oncomplete = (e) => {
          window.dispatchEvent(new CustomEvent(DBStatus, {detail: {status:'loading'}}));
          resolve(table);
        };
        tx.onerror = (e) => {
          window.dispatchEvent(new CustomEvent(DBStatus, {detail: {status:'error'}}));
          reject(e);
        };
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  },
  pathUpdated: function ( path ) {
    return new Promise(function(resolve, reject) {
      console.log(`[DB] last update time ${path}`);

      try {
        const tx = DB.connection.transaction([TABLEU], 'readonly');
        const get = tx.objectStore(TABLEU).get(path);

        get.onsuccess = (e) => {
          resolve(e.target.result);
        };
        tx.onerror = (e) => {
          reject(e);
        };
      } catch (e) {
        reject(e);
      }
    });    
  },
  tableExists: function ( table ) {
    return DB.connection.objectStoreNames.contains(table);
  }
}

export { DB };