import { useState, useEffect} from 'react'
import Pagination from '../components/Pagination';
import invoicesAPI from '../services/invoicesAPI';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'
import TableLoader from '../components/loaders/TableLoader';
 
// pour la traduction
const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée"
}

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "primary",
    CANCELLED: "danger"
}


const InvoicesPage = (props) => {
    const [invoices, setInvoices] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState("")
    const itemsPerPage = 10 

    // loader
    const [loading, setLoading] = useState(true)

    // récup les invoices (factures)
    const fetchInvoice = async () => {
        try{
            const data = await invoicesAPI.findAll()
            setInvoices(data)
            setLoading(false) // fini de charger
        }catch(error)
        {
            console.error(error.response)
            // notification à faire
            toast.error("Erreur lors du chargement des factures")
        }
    }

    useEffect(()=>{
        fetchInvoice()
    },[])

    // gestion de la recherche
    const handleSearch = event => {
        const value = event.currentTarget.value
        setSearch(value)
        setCurrentPage(1)
    }

    const filteredInvoices = invoices.filter(i =>
            i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            i.customer.firstName.toLowerCase().includes(search.toLowerCase()) || 
            i.amount.toString().includes(search.toLowerCase()) ||
            STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())        
        )
    
    const paginatedInvoices = Pagination.getData(filteredInvoices, currentPage, itemsPerPage)

    const formatDate = (str) => moment(str).format('DD/MM/YYYY')

    const handleDelete = async (id) => {
        const originalInvoices = [...invoices]
        setInvoices(invoices.filter(invoice => invoice.id !== id))

        try{
            await invoicesAPI.delete(id)
            toast.warning("La facture "+id+" a bien été suprimée")
        }catch(error)
        {
            // notif à faire 
            setInvoices(originalInvoices)
            toast.error("Une erreur est survenue")
        }
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }
    

    return ( 
        <>
        <div className="d-flex justify-content-between align-items-center">
            <h1>Liste des factures</h1>
            <Link to="/invoices/new" className='btn btn-primary mb-3'>Créer une facture</Link>
        </div>
            {/* filtre */}
            <div className="form-group">
                <input type="text" className="form-control" placeholder='Rechercher...' value={search} onChange={handleSearch} />
            </div>    
             { (!loading) ? (
                   <table className='table table-hover'>
                        <thead>
                            <tr>
                                <th className="text-center">Numéro</th>
                                <th className="text-center">Client</th>
                                <th className="text-center">Date d'envoi</th>
                                <th className="text-center">Statut</th>
                                <th className="text-center">Montant</th>
                                <th className="text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                paginatedInvoices.map(invoice => (
                                    <tr key={invoice.id}>
                                        <td className="text-center">{invoice.id}</td>
                                        <td className="text-center">{invoice.customer.firstName} {invoice.customer.lastName}</td>
                                        <td className="text-center">{formatDate(invoice.sentAt)}</td>
                                        <td className="text-center">
                                            <span className={`badge bg-${STATUS_CLASSES[invoice.status]}`}>
                                                {STATUS_LABELS[invoice.status]}
                                            </span>
                                        </td>
                                        <td className="text-center">{invoice.amount.toLocaleString()}€</td>
                                        <td className="text-center">
                                            <Link to={`/invoices/${invoice.id}`} className="btn btn-sm btn-success mx-3">Editer</Link>
                                            <button onClick={() => handleDelete(invoice.id)} className='btn btn-sm btn-danger'>Supprimer</button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
             ) : (
                <TableLoader />
             )}
                {/* Pagination */}
                {
                    itemsPerPage < filteredInvoices.length && 
                    <Pagination 
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        length={filteredInvoices.length}
                        onPageChanged={handlePageChange}
                    />
                }
        </>
     );
}
 
export default InvoicesPage;