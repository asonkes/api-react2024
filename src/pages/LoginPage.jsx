const LoginPage = (props) => {
    return ( 
        <>
            <div className="row">
                <div className="col-4 offset-4">
                    <h1>Connexion</h1>
                    <form></form>
                </div>
            </div>
        </>
     );
}
 
export default LoginPage;
import Axios from 'axios'
import { jwtDecode } from 'jwt-decode'

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

function logout(){
    window.localStorage.removeItem("authToken")
    delete Axios.defaults.headers["Authorization"]
}

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


export default {
    authenticate: authenticate,
    logout: logout,
    setup: setup
}
