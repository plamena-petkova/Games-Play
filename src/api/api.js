import { setUserData, clearUserData, getUserData } from '../util.js';

const host = 'http://localhost:3030';

async function request(url, options) {
    try {
        const response = await fetch(host + url, options);
        if(response.ok != true) {
            if(response.status == 403) {//problem s token - ako ima iztrivame tokena
                sessionStorage.removeItem('userData');
            }
            const error = await response.json();
            throw new Error(error.message);
            }

        if(response.status == 204) {//v responsa nqma danni 
            return response;
        } else {
            return response.json();//v responsa ima danni
        }         
    } catch (err) { 
        alert(err.message);
        throw err;
    }
}


function createOptions(method = 'get', data) {
    const options = {
        method,
        headers: {}
    };

    if(data != undefined) {
        options.headers['Content-Type'] = 'applications/json'
        options.body = JSON.stringify(data);
    }
    const userData = getUserData();
    
    if(userData != null) { 
        options.headers['X-Authorization'] = userData.token;
        
    }

    return options;

}

export async function get(url) {
    return request(url, createOptions());

}


export async function post(url, data) {
    return request(url, createOptions('post', data));
}

export async function put(url, data) {
    return request(url, createOptions('put', data));


}

export async function del(url) {
    return request(url, createOptions('delete'));
}


export async function login(email, password) {
    const result = await post('/users/login', { email, password });
    const userData = {
        email: result.email,
        id: result._id,//dali e avtor na konkretna publikaciq
        token: result.accessToken//za da pravim otorizirani zaqvki
    };

    setUserData(userData);

    return result;

}

export async function register(email, password) {//kopiran login sashtoto e
    const result = await post('/users/register', { email, password });
    const userData = {
        email: result.email,
        id: result._id,//dali e avtor na konkretna publikaciq
        token: result.accessToken//
    };

    setUserData(userData);

    return result;

}

export async function logout() {
     get('/users/logout');
    clearUserData();

}

