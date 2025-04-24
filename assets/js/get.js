import { XHR } from './XHR.js';
import { BIN } from './BIN.js';
import { DB } from './DB.js';
import { NUM } from './NUM.js';
import { config } from './config.js';
import { Fuse } from './fuse.js';
import { HTML } from './HTML.js';

const manifestOkay = function(headers, requestDB) {
  const lastModified = Date.parse(headers.lastmodified) / 1000;
  
  window.dispatchEvent(new CustomEvent(DB.statusEvent, {detail: {status:'lastModified',  path:BIN.dataPath, timestamp:lastModified}}));

  XHR.get(config.appRoot + 'query/manifest.json').then((xhrManifest) => {
    console.log(`[manifest] status: okay`);
    BIN.initTime = new Date().getTime();
    BIN.manifest = JSON.parse( xhrManifest );

    window.dispatchEvent(new CustomEvent(DB.statusEvent, {detail: {status:'manifestLoaded'}}));

    DB.pathUpdated(BIN.dataPath).then((result) => {
      if ( typeof result == 'undefined' || lastModified > result.unixtime ) {
        let ts = (typeof result != 'undefined')
          ? result.unixtime
          : 0;

        console.log(`[manifestOkay] updated: ${ts}`);
        window.dispatchEvent(new CustomEvent(DB.statusEvent, {detail: {status:'updated', timestamp:ts, datapath: BIN.dataPath}}));
        //*
        XHR.bin(BIN.dataPath + BIN.manifest.dataFiles.values).then((xhrData) => {
          let UPV = BIN.unpackVal( xhrData );

          console.log(UPV);
          DB.storeData( DB.valuesTable, BIN.dataPath, UPV ).catch(errorHandler);
        }).catch(errorHandler);
        /**/
        XHR.bin(BIN.dataPath + BIN.manifest.dataFiles.geos).then((xhrData) => {
          let UPG = BIN.unpackGeo( xhrData );

          console.log(UPG);
          DB.storeData( DB.geosTable, BIN.dataPath, UPG ).catch(errorHandler);
        }).catch(errorHandler);
      } else {
        console.log(`[manifestOkay] cached ${result.unixtime}`);
        window.dispatchEvent(new CustomEvent(DB.statusEvent, {detail: {status:'lastModified', timestamp:result.unixtime}}));
        window.dispatchEvent(new CustomEvent(DB.statusEvent, {detail: {status:'cached'}}));
      }
    }).catch(errorHandler);



  }).catch(errorHandler);
}

const errorHandler = function(error) {
  console.error(error);
  console.log(new Error().stack);
}

let get = (dataPath, geoid) => {
  BIN.dataPath = dataPath;

  DB.init().then((db) => {
    if ( DB.tableExists(DB.valuesTable) && DB.tableExists(DB.geosTable) ) {
      XHR.initTime = new Date().getTime();
      XHR.check(config.appRoot + 'query/manifest.json').then(manifestOkay).catch(errorHandler);
    }
  }).catch(errorHandler);
};



export { get, XHR, BIN, DB, NUM, config, Fuse, HTML };