import Axios from 'axios'

function findAll()
{
    return Axios.get("http://apicourse.myepse.be/api/invoices/")
                .then(response => response.data['hydra:member'])
}

function deleteInvoice(id)
{
    return Axios.delete(`http://apicourse.myepse.be/api/invoices/${id}`)
}

function find(id) 
{
    return Axios.get(`http://apicourse.myepse.be/api/invoices/${id}`)
                .then(response => response.data)
}

function createInvoice(invoice){
    return Axios.post(`http://apicourse.myepse.be/api/invoices/`, {...invoice, customer:`api/customers/${invoice.customer}`})
}

function updateInvoice(id, invoice) {
    const headers = {
        'Content-Type': 'application/merge-patch+json'
    }
    return Axios.patch(`http://apicourse.myepse.be/api/invoices/${id}`,{...invoice, customer:`api/customers/${invoice.customer}`}, {headers})
}

export default {
    create: createInvoice,
    find: find,
    findAll: findAll,
    delete: deleteInvoice
}