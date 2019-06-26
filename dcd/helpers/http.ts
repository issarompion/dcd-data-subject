import * as fetch from 'node-fetch'

/**
 * A small helper function to make a GET request to the api.
 * It includes a bearer token in the request header.
 * @param url
 * @param authorization
 * @returns {Promise<>}
 */
export const GETRequest = (url, authorization) => fetch(url, {
  headers: {
    Authorization: 'bearer ' + authorization,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}
}).then((res) => {
  console.log('result');
  if (res.ok) {
      console.log('result ok');
      try {
          console.log('return json');
          return Promise.resolve(res.json());
      } catch (e) {
          return Promise.resolve(res.text());
      }
  } else {
      return Promise.resolve(res.text());
  }
})
//.catch(err => console.log(err));
.catch(err => { throw err });

/**
 * A small helper function to make a POST request to the backend.
 * It includes a bearer token in the request header.
 * @param url
 * @param authorization
 * @param body
 * @returns {Promise<>}
 */
export const POSTRequest = (url:string,authorization:string,body:{}) => {
  const params = {
      headers: {
          Authorization: 'bearer ' + authorization,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
      method: 'POST'
  };
  if (body !== undefined) {
      const bodyStr = JSON.stringify(body);
      params.headers['Content-length'] = bodyStr.length;
      params['body'] = bodyStr;
  }
  return fetch(url, params)
      .then((res) => {
          console.log('result');
          if (res.ok) {
              console.log('result ok');
              try {
                  console.log('return json');
                  return Promise.resolve(res.json());
              } catch (e) {
                  return Promise.resolve(res.text());
              }
          } else {
              return Promise.resolve(res.text());
          }
      })
      .catch(err => { throw err });
      //.catch(err => console.log(err));
};
