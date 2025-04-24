/**
 * https://www.digitalocean.com/community/tools/minify
 **/

const BINProgress = 'BINProgressUpdate';

let BIN = {
  initTime: new Date().getTime(),
  progressEvent: BINProgress,
  dataPath: null,
  manifest: null,
  unpackVal: function ( buffer ) {
    try {
      window.dispatchEvent(new CustomEvent(BINProgress, {detail: 0}));

      const view  = new DataView(buffer);
      const utf8  = new TextDecoder('utf-8', {ignoreBOM:true});
      
      // file header
      let created  = view.getUint32(0); // created timestamp
      let rowCount = view.getUint16(4); // number of data rows
      
      let
        arr = [],
        geo = null,
        row = -1,
        idx = 6,
        pro = 0;
        
      let blankData = [];
      
      for (const [i, fact] of Object.entries(this.manifest.factIdx)) {
        blankData[i - 1] = {
          factIdx: i,
          unitIdx: 0,
          datasetIdx: 0,
          flagIdx: 0,
          footnoteIdx: 0,
          sumLevel: 0,
          value: 'X'
        };
      }

      
      do {
        let rowobj = {},
            header = this.unpackValHDR( view.getUint32(idx) ),
            geoLen = parseInt( this.manifest.sumLevelIdx[ header[5] ].length ),
            valLen = parseInt( header[6] );

        rowobj.factIdx     = header[0];
        rowobj.unitIdx     = header[1];
        rowobj.datasetIdx  = header[2];
        rowobj.flagIdx     = header[3];
        rowobj.footnoteIdx = header[4];
        rowobj.sumLevel    = header[5];
        idx += 4;

        let geoid = utf8.decode( buffer.slice(idx, idx + geoLen) );
        idx += geoLen;

        rowobj.value = utf8.decode( buffer.slice(idx, idx + valLen) );
        idx += valLen;

        if ( geoid !== geo ) {
          row++;
          geo = geoid;
          arr[row] = {geoid:geo, data:Array.from(blankData)};
        }

        arr[row].data[header[0] - 1] = rowobj;

        let pct = Math.round((idx / view.byteLength) * 100);
        if ( pct !== pro ) {
          pro = pct;
          window.dispatchEvent(new CustomEvent(BINProgress, {detail: pro}));
        }
      } while ( idx < view.byteLength );

      return arr;
    } catch(e) {
      console.error(e);
    }
  },
  unpackGeo: function ( buffer ) {
    try {
      window.dispatchEvent(new CustomEvent(BINProgress, {detail: 0}));

      const view  = new DataView(buffer);
      const utf8  = new TextDecoder('utf-8', {ignoreBOM:true});
      
      // file header
      let created  = view.getUint32(0); // created timestamp
      let rowCount = view.getUint16(4); // number of data rows

      let
        arr = [],
        geo = null,
        row = -1,
        idx = 6,
        pro = 0;
        
      do {
        let rowobj = {},
            header = this.unpackGeoHDR( view.getUint32(idx) ),
            geoLen = parseInt( header[0] ),
            valLen = parseInt( header[1] ),
            ascLen = parseInt( header[2] ),
            urlLen = parseInt( header[3] );

        rowobj.sumLevelIdx = header[4];
        rowobj.datasetIdx  = header[5];
        idx += 4;

        rowobj.geoid = utf8.decode( buffer.slice(idx, idx + geoLen) );
        idx += geoLen;

        rowobj.data = {};
        rowobj.data.fullname  = utf8.decode( buffer.slice(idx, idx + valLen) );
        idx += valLen;
        rowobj.data.asciiname = utf8.decode( buffer.slice(idx, idx + ascLen) );
        idx += ascLen;
        rowobj.data.urlname   = utf8.decode( buffer.slice(idx, idx + urlLen) );
        idx += urlLen;

        arr.push( rowobj );

        let pct = Math.round((idx / view.byteLength) * 100);
        if ( pct !== pro ) {
          pro = pct;
          window.dispatchEvent(new CustomEvent(BINProgress, {detail: pro}));
        }
      } while ( idx < view.byteLength );

      return arr;
    } catch(e) {
      console.error(e);
    }
  },
  unpackValHDR: function ( bin ) {
    let
      idx = 0,
      ret = [];

    /**
     * Row Header Map
     *
     * idx  ID            bits  mask          uint32 map
     * 0    factIdx       7     127 01111111  1111 1110 0000 0000 0000 0000 0000 0000
     * 1    unitIdx       3       7 00000111  0000 0001 1100 0000 0000 0000 0000 0000
     * 2    datasetIdx    2       3 00000011  0000 0000 0011 0000 0000 0000 0000 0000
     * 3    flagIdx       4      15 00001111  0000 0000 0000 1111 0000 0000 0000 0000
     * 4    footnoteIdx   5      31 00011111  0000 0000 0000 0000 1111 1000 0000 0000
     * 5    sumLevelIdx   5      31 00011111  0000 0000 0000 0000 0000 0111 1100 0000
     * 6    lenValue      6      63 00111111  0000 0000 0000 0000 0000 0000 0011 1111
     **/
    // 6 - lenValue
    idx = 63 & bin;
    ret.unshift( idx );
    bin = bin >>> 6;

    // 5 - lenGeoid
    idx = 31 & bin;
    ret.unshift( idx );
    bin = bin >>> 5;

    // 4 - footnoteIdx
    idx = 31 & bin;
    //ret.unshift( idx ? this.manifest.footnoteIdx[idx].code : null )
    ret.unshift( idx )
    bin = bin >>> 5;

    // 3 - flagIdx
    idx = 15 & bin;
    //ret.unshift( idx ? this.manifest.flagIdx[idx].code : null )
    ret.unshift( idx )
    bin = bin >>> 4;

    // 2 - datasetIdx
    idx =  3 & bin;
    //ret.unshift( idx ? this.manifest.datasetIdx[idx] : null )
    ret.unshift( idx )
    bin = bin >>> 2;

    // 1 - unitIdx
    idx =  7 & bin;
    //ret.unshift( idx ? this.manifest.unitIdx[idx] : null )
    ret.unshift( idx )
    bin = bin >>> 3;

    // 0 - factIdx
    //ret.unshift( bin ? this.manifest.factIdx[bin].mnemonic : null );
    ret.unshift( bin );

    return ret;
  },
  unpackGeoHDR: function ( bin ) {
    let
      idx = 0,
      ret = [];

    /**
     * Row Header Map
     *
     * idx  ID            bits  mask          short map
     * 0    lengeoid      5      31 00011111  1111 1000 0000 0000 0000 0000 0000 0000
     * 1    lenname       7     127 01111111  0000 0111 1111 0000 0000 0000 0000 0000
     * 2    lenascii      7     127 01111111  0000 0000 0000 1111 1110 0000 0000 0000
     * 3    lenurl        7     127 01111111  0000 0000 0000 0000 0001 1111 1100 0000
     * 4    sumlevelIdx   3       7 00000111  0000 0000 0000 0000 0000 0000 0011 1000
     * 5    datasetIdx    3       7 00000111  0000 0000 0000 0000 0000 0000 0000 0111
     **/
    // 5 - datasetIdx
    idx = 7 & bin;
    ret.unshift( idx );
    bin = bin >>> 3;

    // 4 - sumlevelIdx
    idx = 7 & bin;
    ret.unshift( idx );
    bin = bin >>> 3;

    // 3 - lenurl
    idx = 127 & bin;
    ret.unshift( idx )
    bin = bin >>> 7;

    // 2 - lenascii
    idx = 127 & bin;
    ret.unshift( idx )
    bin = bin >>> 7;

    // 1 - lenname
    idx =  127 & bin;
    ret.unshift( idx )
    bin = bin >>> 7;

    // 0 - lengeoid
    ret.unshift( bin );

    return ret;
  }};

export { BIN };