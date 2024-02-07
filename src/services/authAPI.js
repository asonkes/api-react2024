import Axios from 'axios'
import { jwtDecode } from 'jwt-decode'

// Axios plus permformant que fetch...
function authenticate(credentials)
{
    return Axios
            .post("http://apicourse.myepse.be/api/login_check", credentials)
            .then(response => response.data.token)
            .then(token => {
                // mettre le token dans le localStorage
                window.localStorage.setItem("authToken", token)
                // aouter à Axios pour chaque req, le bearer token
                Axios.defaults.headers["Authorization"] = "Bearer " + token
                return true
            })
}

// Permet de se déconnecter
function logout(){
    window.localStorage.removeItem("authToken")
    delete Axios.defaults.headers["Authorization"]
}

// Si jamais il y a un chargement et que l'utilisateur a un token valide, 
function setup(){
    // voir si on a un token
    const token = window.localStorage.getItem("authToken")
    if(token)
    {
        const jwtData = jwtDecode(token)
        if((jwtData.exp * 1000) > new Date().getTime())
        {
            Axios.defaults.headers["Authorization"]="Bearer " + token
        }
    }
}

function isAuthenticated() {
    const token = window.localStorage.getItem("authToken")
    if(token)
    {
        const jwtData = jwtDecode(token)
        if((jwtData.exp * 1000) > new Date().getTime())
        {
            return true // ok il est authentifié
        }
        return false // token existe mais expiré 
    }
    return false // pas de token
}


export default {
    authenticate: authenticate,
    logout: logout,
    setup: setup,
    isAuthenticated: isAuthenticated
}