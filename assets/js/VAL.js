/**
 * https://www.digitalocean.com/community/tools/minify
 **/

const VALProgress = 'VALProgressUpdate';

let VAL = {
  initTime: new Date().getTime(),
  progressEvent: VALProgress,
  created: 0,
  rowCount: 0,
  manifest: null,
  unpack: function ( data ) {
    try {
      let
        arr  = [],
        geo  = null,
        idx  = -1,
        prog = 0,
        last = 0;

      const rows   = data.split('|');
      const hdrBin = rows.shift().split('~').map( this.unpackBin, this );
      
      // JS Date works in milliseconds
      this.created  = Number(hdrBin[0]);
      this.rowCount = Number(hdrBin[1]);
      
      console.log(`[VAL] unpacking ${rows.length} data rows with ${this.rowCount} stored`);

      window.dispatchEvent(new CustomEvent(VALProgress, {detail: 0}));
      rows.map(
        e => {
          let
            r = e.split('~').map( this.decode, this ),
            f = r.shift(),
            d = f.concat(r);

          if ( d[7] !== geo ) {
            idx++;
            geo = d[7];
            arr[idx] = {geoid:geo, data:[]};
          }

          arr[idx].data.push({
            mnemonic: d[0],
            unit:     d[1],
            dataset:  d[2],
            flag:     d[3],
            footnote: d[4],
            value:    d[6]
          });

          let curr = Math.round((prog / rows.length) * 100);
          if ( curr !== last ) {
            window.dispatchEvent(new CustomEvent(VALProgress, {detail: curr}));
            last = curr;
          }
          prog++;
        }
      );
      //window.dispatchEvent(new CustomEvent(VALProgress, {detail: 0}));
      return arr;
    } catch(e) {
      console.error(e);
    }
  },
  decode: function ( value, key ) {
    switch ( key ) {
      case 0:
        return this.unpackINT( value );
      default:
        return this.unpackSTR( value );
    }
  },
  unpackINT: function ( value ) {
    let
      idx = 0,
      ret = [],
      bin = Number(this.unpackBin( value )); // truncate BigInt to Int32

    /**
     * idx  ID            bits  mask         int32 map
     * 0    factIdx       7      0           1111 1110 0000 0000 0000 0000 0000 0000
     * 1    unitIdx       3      7 00000111  0000 0001 1100 0000 0000 0000 0000 0000
     * 2    datasetIdx    2      3 00000011  0000 0000 0011 0000 0000 0000 0000 0000
     * 3    flagIdx       4     15 00001111  0000 0000 0000 1111 0000 0000 0000 0000
     * 4    footnoteIdx   5     31 00011111  0000 0000 0000 0000 1111 1000 0000 0000
     * 5    sumLevelIdx   5     31 00011111  0000 0000 0000 0000 0000 0111 1100 0000
     * 6    lenValue      6     63 00111111  0000 0000 0000 0000 0000 0000 0011 1111
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
    ret.unshift( idx ? this.manifest.footnoteIdx[idx].code : null )
    bin = bin >>> 5;

    // 3 - flagIdx
    idx = 15 & bin;
    ret.unshift( idx ? this.manifest.flagIdx[idx].code : null )
    bin = bin >>> 4;

    // 2 - datasetIdx
    idx =  3 & bin;
    ret.unshift( idx ? this.manifest.datasetIdx[idx] : null )
    bin = bin >>> 2;

    // 1 - unitIdx
    idx =  7 & bin;
    ret.unshift( idx ? this.manifest.unitIdx[idx] : null )
    bin = bin >>> 3;

    // 0 - factIdx
    ret.unshift( bin ? this.manifest.factIdx[bin].mnemonic : null );

    return ret;
  },
  unpackSTR: function ( value ) {
    /**
     * Unpacks BigInt to a base 16 sequence where every 2 octets represent a character code.
     */
    let bin = this.unpackBin( value ).toString(16);
    let ret = bin.match(/.{2}/g).map( e=>{return String.fromCharCode(parseInt(e, 16))}).join('');

    return ret;
  },
  unpackBin:  function ( value ) {
    let
      bin  = BigInt(0),
      pow  = BigInt(0),
      base = BigInt(this.manifest.baseEncoding.length);

    while ( value ) {
      var
        idx = value.length - 1,
        chr = value.substring( idx, idx + 1 ),
        dgt = this.manifest.baseEncoding.indexOf( chr );

      bin += base ** pow * BigInt(dgt);
      value = value.substring( 0, idx );

      pow++;
    }

    return bin;
  }
};

export { VAL };