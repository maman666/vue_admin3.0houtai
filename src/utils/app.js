
import cookie from 'cookie_js';

const adminToken = 'admin_token'

export function getToken(){
    return cookie.get(adminToken);
}

export function setToken(token){
   return cookie.set(adminToken,token);
}

export function removeToken(){
    return cookie.remove(adminToken);
 }
 

export function setUsername(value){
    return cookie.set('username',value);
}

export function getUsername(){
    return cookie.get('username');
}

export function removeUsername(){
    return cookie.remove('username');
}