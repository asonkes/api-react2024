import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import authAPI from '../services/authAPI';
import AuthContext from '../contexts/AuthContext';
import Field from "../components/forms/Field"

const LoginPage = (props) => {

    const navigate = useNavigate()
    const {setIsAuthenticated} = useContext(AuthContext)

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    })

    const [ error, setError ] = useState("")

    const handleChange = (event) => {
        const value = event.currentTarget.value
        const name = event.currentTarget.name 

        // pour copier ... et avec une virgule on peut ajouter ou remplacer un élément dans ma copie

        setCredentials({...credentials, [name]:value})
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        try{
            await authAPI.authenticate(credentials)
            setError("")
            setIsAuthenticated(true)
            navigate("/customers", {replace: true})
        }catch(error)
        {
            setError("Aucun compte ne possède cette adresse e-mail ou les information ne corresponde pas")
        }
    }

    return ( 
        <>
            <div className="row">
                <div className="col-4 offset-4">
                    <h1>Connexion</h1>

                    <form onSubmit={handleSubmit}>
                        <Field>
                            label="Adresse E-mail"
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            placeholder='Adresse E-mail de connexion'
                            error={error}
                        </Field>

                        <Field>
                            label="Mot de passe"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            placeholder='Mot de passe'
                            error={error}
                            type="password"
                        </Field>
                 
                        <div className="form-group my-3">
                            <label htmlFor="username">Adresse E-mail</label>
                            <input 
                                type="email"
                                value={credentials.username}
                                onChange={handleChange}
                                placeholder='Adresse E-mail de connexion'
                                id="username"
                                name="username"
                                className={"form-control " + (error && "is-invalid")}
                            />
                            { error && (
                                <p className='invalid-feedback'>{error}</p>
                            )} 
                        </div>
                        <div className="form-group my-3">
                            <label htmlFor="password">Mot de passe</label>
                            <input 
                                type="password" 
                                value={credentials.password}
                                onChange={handleChange}
                                placeholder='Mot de passe'
                                id="password"
                                name="password"
                                className='form-control'    
                            />
                        </div>
                        <div className="form-group my-3">
                            <button className="btn btn-success">Connexion</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
     );
}
 
export default LoginPage;