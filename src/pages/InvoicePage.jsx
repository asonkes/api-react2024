import { useState, useEffect } from "react";
import invoicesAPI from "../services/invoicesAPI";
import customersAPI from "../services/customersAPI";
import { useParams, useNavigate, Link } from "react-router-dom";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import { toast } from 'react-toastify'
 
const InvoicePage = (props) => {

    let {id="new"} = useParams()
    const navigate = useNavigate()

    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT",
        chrono: ""
    })

    const [customers, setCustomers] = useState([])

    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: ""
    })

    const [editing, setEditing] = useState(false)

    const fetchCustomers = async () => {
        try{
            const data = await customersAPI.findAll()
            setCustomers(data)
            if(id === "new") setInvoice({...invoice, customer: data[0].id})
        }catch(error)
        {
            toast.error("Impossible de charger les client")
            navigate("/invoices", {replace: true})
            // notif à faire
        }
    }

    const fetchInvoice = async id => {
        try{
            const {amount, status, customer, chrono} = await invoicesAPI.find(id)
            setInvoice({amount, status, customer: customer.id, chrono})
        }catch(error)
       {
            toast.error("Impossible de charger la facture demandée")
            navigate("/invoices", {replace: true})
            // notif à faire
        }
    }

    useEffect(()=>{
        fetchCustomers()
    },[])

    useEffect(()=>{
        if(id !=="new")
        {
            // récup la facture avec son id et modifier le state editing
            fetchInvoice(id)
            setEditing(true)
        }
    },[id])

    const handleChange = (event) => {
        const {name, value} = event.currentTarget
        setInvoice({...invoice, [name]:value})
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        try{
            // ça dépend du mode édition 
            if(editing)
            {
                // update
                await invoicesAPI.update(id, invoice)
                // notif
                toast.success("La facture a bien été modifiée")
            }else{
                // create
                await invoicesAPI.create(invoice)
                // redirection + notif
                toast.success("La facture a bien été enregistrée")
                navigate("/invoices", {replace: true})
            }
        }catch({response})
        {
            const {violations} = response.data
            if(violations){
                const apiErros = {}
                violations.forEach(({propertyPath, message}) => {
                    apiErros[propertyPath] = message
                })
                setErrors(apiErros)
            }
            toast.error("Une erreur est survenue")
        }
    }


    return ( 
        <>
            {editing ? <h1>Modification d'une facture</h1> : <h1>Création d'une facture</h1>}
            <form onSubmit={handleSubmit}>
                <Field 
                    name="amount"
                    type="number"
                    placeholder="Montant de la facture"
                    label="Montant"
                    onChange={handleChange}
                    value={invoice.amount}
                    error={errors.amount}
                />
                <Select
                    name="customer"
                    label="Client"
                    value={invoice.customer}
                    error={errors.customer}
                    onChange={handleChange}
                >
                    {customers.map(customer => <option key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}</option>)}
                </Select>
                <Select
                    name="status"
                    label="Statut"
                    value={invoice.status}
                    error={errors.status}
                    onChange={handleChange}
                >
                    <option value="SENT">Envoyée</option>
                    <option value="PAID">Payée</option>
                    <option value="CANCELLED">Annulée</option>
                </Select>
                <div className="my-3">
                    {
                        editing ?  <button type="submit" className="btn btn-warning me-1">Modifier</button> :  <button type="submit" className="btn btn-success me-1">Créer</button>
                    }
                   <Link to="/invoices" className="btn btn-secondary">Retour aux factures</Link>
                </div>
            </form>
        </>
     );
}
 
export default InvoicePage;