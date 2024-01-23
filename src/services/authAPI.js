import Axios from 'axios';
import {jwtDecode} from 'jwt-decode';


function authenticate(credentials) {
    return Axios 
              .post("http://apicourse.myepse.be/api/login_check", credentials)
              .then(response => response.data.token)
              .then(token => {
                // mettre le token dans le localstaorage
                window.localStorage.setItem("authToken", token)
                // ajouter à Axios pour chaque requêtes, le bearer token
                Axios.defaults.headers["Authorization"] = "Bearer" + token
                return true
              })
}

function logout() {
    window.localStorage.removeItem("authToken")
    delete Axios.defaults.headers("Authorization")
}

function setup() {
    // voir si on a un token
    const token = window.localStorage.getItem("authToken")
    if(token) {
        const jwtData = jwtDecode(token)
        if((jwtData.exp * 1000) > new Date().getTime())
        {
            Axios.defaults.headers["Authorization"]="Bearer" + token
        }
    }
}
