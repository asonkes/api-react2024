import { useState } from "react";
import Field from "../components/forms/Field";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import {toast} from 'react-toastify'

const RegisterPage = (props) => {
    const navigate = useNavigate()

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    })

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    })

    const handleChange = (event) => {
        const {name, value} = event.currentTarget 
        setUser({...user, [name]:value})
    }
    
    const handleSubmit = async (event) => {
        event.preventDefault()
        const apiErrors = {}
        if(user.password !== user.passwordConfirm)
        {
            apiErrors.passwordConfirm = "Votre confirmation de mot de passe ne confirme pas l'original"
            setErrors(apiErrors)
            // on arrête directement 
            return 
        }
        try{
            await Axios.post("http://apicourse.myepse.be/api/users", user)
            setErrors({})
            toast.success("Vous êtes inscrit, vous pouvez vous connecté")
            navigate("/login", {replace:true})
        }catch({response})
        {
            const {violations} = response.data 
            if(violations){
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message
                })
                setErrors(apiErrors)
            }
            toast.error("des erreurs dans le formulaire")
        }
    }

    return ( 
        <>
            <h1>Inscription</h1>
            <form onSubmit={handleSubmit}>
                <Field 
                    name="firstName"
                    label="Prénom"
                    placeholder="Votre prénom"
                    value={user.firstName}
                    error={errors.firstName}
                    onChange={handleChange}
                />
                <Field 
                    name="lastName"
                    label="Nom"
                    placeholder="Votre nom"
                    value={user.lastName}
                    error={errors.lastName}
                    onChange={handleChange}
                />
                <Field 
                    name="email"
                    type="email"
                    label="Adresse E-mail"
                    placeholder="Votre adresse e-mail"
                    value={user.email}
                    error={errors.email}
                    onChange={handleChange}
                />
                <Field 
                    name="password"
                    label="Mot de passe"
                    type="password"
                    placeholder="Votre mot de passe"
                    value={user.password}
                    error={errors.password}
                    onChange={handleChange}
                />
                <Field 
                    name="passwordConfirm"
                    label="Confirmation de votre mot de passe"
                    type="password"
                    placeholder="Confirmer votre mot de passe"
                    value={user.passwordConfirm}
                    error={errors.passwordConfirm}
                    onChange={handleChange}
                />
                <div className="my-3">
                    <button type="submit" className="btn btn-success me-2">Confirmation</button>
                    <Link to="/login" className="btn btn-secondary">J'ai déjà un compte</Link>
                </div>

            </form>

        </>
     );
}
 
export default RegisterPage;