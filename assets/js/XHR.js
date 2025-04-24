/**
 * https://www.digitalocean.com/community/tools/minify
 **/
const XHRProgress = 'XHRProgressUpdate';

const XHR = {
  initTime: new Date().getTime(),
  progressEvent: XHRProgress,
  post: function (url, args) {
    return new Promise(function(resolve, reject) {
      console.log(`[XHR] posting ${url}`);

      if ( typeof args === 'undefined' ) {
        args = '';
      }

      let params = typeof args == 'string' ? args : Object.keys(args).map(
        (k) => { return encodeURIComponent(k) + '=' + encodeURIComponent(args[k]) }
      ).join('&');

      const xhr = new XMLHttpRequest();

      window.dispatchEvent(new CustomEvent(XHRProgress, {detail:0}));
      xhr.addEventListener('progress', XHR.progress);

      xhr.open('POST', url);
      xhr.onload = () => {
        //window.dispatchEvent(new CustomEvent(XHRProgress, {detail:0}));

        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject({
            status: xhr.status,
            statusText: xhr.statusText
          });
        }
      };
      xhr.onerror = () => {
        window.dispatchEvent(new CustomEvent(XHRProgress, {detail:0}));

        reject({
          status: xhr.status,
          statusText: xhr.statusText
        });
      };
      xhr.onabort = () => {
        window.dispatchEvent(new CustomEvent(XHRProgress, {detail:0}));

        reject({
          status: xhr.status,
          statusText: xhr.statusText
        });
      };

      xhr.setRequestHeader(
        'X-Requested-With',
        'XMLHttpRequest'
      );
      xhr.setRequestHeader(
        'Content-Type',
        'application/x-www-form-urlencoded'
      );

      xhr.send( params );
    });
  },
  get: function (url, args) {
    return new Promise(function(resolve, reject) {
      try {
        console.log(`[XHR] getting ${url}`);

        if ( typeof args === 'undefined' ) {
          args = '';
        }

        let params = typeof args == 'string' ? args : Object.keys(args).map(
          (k) => { return encodeURIComponent(k) + '=' + encodeURIComponent(args[k]) }
        ).join('&');

        const xhr = new XMLHttpRequest();

        window.dispatchEvent(new CustomEvent(XHRProgress, {detail:0}));
        xhr.addEventListener('progress', XHR.progress);

        xhr.open('GET', url);
        xhr.onload = () => {
          //window.dispatchEvent(new CustomEvent(XHRProgress, {detail:0}));

          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.response);
          } else {
            reject({
              status: xhr.status,
              statusText: xhr.statusText
            });
          }
        };
        xhr.onerror = () => {
          window.dispatchEvent(new CustomEvent(XHRProgress, {detail:0}));

          reject({
            status: xhr.status,
            statusText: xhr.statusText
          });
        };
        xhr.onabort = () => {
          window.dispatchEvent(new CustomEvent(XHRProgress, {detail:0}));

          reject({
            status: xhr.status,
            statusText: xhr.statusText
          });
        };
        xhr.send( params );
      } catch (e) {
        console.log(e);
      }
    });
  },
  bin: function (url, args) {
    return new Promise(function(resolve, reject) {
      try {
        console.log(`[XHR] binary ${url}`);

        if ( typeof args === 'undefined' ) {
          args = '';
        }

        let params = typeof args == 'string' ? args : Object.keys(args).map(
          (k) => { return encodeURIComponent(k) + '=' + encodeURIComponent(args[k]) }
        ).join('&');

        const xhr = new XMLHttpRequest();
        xhr.responseType = 'arraybuffer';

        window.dispatchEvent(new CustomEvent(XHRProgress, {detail:0}));
        xhr.addEventListener('progress', XHR.progress);

        xhr.open('GET', url);
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve( xhr.response );
            //resolve( new Uint8Array(xhr.response) );
          } else {
            reject({
              status: xhr.status,
              statusText: xhr.statusText
            });
          }
        };
        xhr.onerror = () => {
          window.dispatchEvent(new CustomEvent(XHRProgress, {detail:0}));

          reject({
            status: xhr.status,
            statusText: xhr.statusText
          });
        };
        xhr.onabort = () => {
          window.dispatchEvent(new CustomEvent(XHRProgress, {detail:0}));

          reject({
            status: xhr.status,
            statusText: xhr.statusText
          });
        };
        xhr.send( params );
      } catch (e) {
        console.log(e);
      }
    });
  },
  check: function (url, args) {
    return new Promise(function(resolve, reject) {
      console.log(`[XHR] head ${url}`);

      if ( typeof args === 'undefined' ) {
        args = '';
      }

      let params = typeof args == 'string' ? args : Object.keys(args).map(
        (k) => { return encodeURIComponent(k) + '=' + encodeURIComponent(args[k]) }
      ).join('&');

      const xhr = new XMLHttpRequest();
      
      xhr.open('HEAD', url, true);

      xhr.onreadystatechange = () => {
        if (xhr.status == 200 && xhr.readyState >= 2) {
          const headers = xhr.getAllResponseHeaders()
            .split(/[\r\n]+/)
            .map( (x) => {return x.split(/(?<=^[^:]*?):\s*/)})
            .reduce((ac, cv)=>{ac[cv[0].replace(/-/g, '')] = cv[1]; return ac;}, {});

          resolve( headers );
          xhr.abort();
        }
      }

      xhr.onerror = () => {
        reject({
          status: xhr.status,
          statusText: xhr.statusText
        });
      };
      xhr.onabort = () => {
        reject({
          status: xhr.status,
          statusText: xhr.statusText
        });
      };
      xhr.send( params );
    });
  },
  progress: function (e) {
    if (e.lengthComputable) {
      let prog = Math.round((e.loaded / e.total) * 100);
      window.dispatchEvent(new CustomEvent(XHRProgress, {detail: prog}));
    }
  }
};

export { XHR };