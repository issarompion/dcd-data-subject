import * as fetch from 'node-fetch'
  /**
 * make get request to the server to retrieve user.
 * It includes a bearer token in the request header.
 * @param url
 * @param authorization
 * @param response
 * @param next
 * @returns {Promise<>}
 */
export const makeDataRequest = (url, authorization) => fetch(
    url, {
    headers: {Authorization: 'bearer ' + authorization}
  })
    .then((res) => {
        return res.ok ? res.json() : res.text()
    })

export const RetrieveThings = (authorization:string) => fetch(
    //.env
    'https://dwd.tudelft.nl/api/things', {
    headers: {Authorization: 'bearer ' + authorization}
  })
    .then((res) => {
        return res.ok ? res.json() : res.text()
    })

export const RetrieveThing = (authorization : string,thingId : string)=>  fetch(
    //.env
    'https://dwd.tudelft.nl/api/things/'+thingId, {
    headers: {Authorization: 'bearer ' + authorization}
  })
    .then((res) => {
        return res.ok ? res.json() : res.text()
    })
  
export async function GetThing (authorization : string,thingId : string) {
      try {
        const resp = await fetch(
          //.env
          'https://dwd.tudelft.nl/api/things/'+thingId, {
          headers: {Authorization: 'bearer ' + authorization}
        }).then((res) => {
          //return res.ok ? res.json() : res.text()
      }).then((body) => {
        if(body.thing === undefined){
            throw new TypeError('body is undifined : no thing found, check if the id and token of your thing are valid')
        }else{
           return body
        }
      })
        console.log(resp)
        return resp
      } catch (err) {
           console.log(err)
        }
   }

export const RetrieveProperty = (authorization : string,thingId : string, propertyId: string )=>  fetch(
        //.env
        'https://dwd.tudelft.nl/api/things/'+thingId+'/properties'+'/'+propertyId, {
        headers: {Authorization: 'bearer ' + authorization}
      })
        .then((res) => {
            return res.ok ? res.json() : res.text()
        })

export const RetrieveUserId = (authorization:string) =>  fetch(
  //.env
  'https://cors-anywhere.herokuapp.com/https://dwd.tudelft.nl/userinfo', {
  headers: {Authorization: 'bearer ' + authorization}
})
  .then((res) => {
      return res.ok ? res.json() : res.text()
  })

export const RetrieveUserInfo = (authorization:string,UserId: string) =>  fetch(
  //.env
  'https://dwd.tudelft.nl/api/persons/'+UserId, {
  headers: {Authorization: 'bearer ' + authorization}
})
  .then((res) => {
      return res.ok ? res.json() : res.text()
  })
