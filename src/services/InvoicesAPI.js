import Axios from 'axios'
import { INVOICES_API } from '../config'

function findAll()
{
    return Axios.get(INVOICES_API)
                .then(response => response.data['hydra:member'])
}

function deleteInvoice(id)
{
    return Axios.delete(`${INVOICES_API}/${id}`)
}

function find(id)
{
    return Axios.get(`${INVOICES_API}/${id}`)
                .then(response => response.data)
}

function createInvoice(invoice){
    return Axios.post(INVOICES_API, {...invoice, customer: `api/customers/${invoice.customer}`})
}

function updateInvoice(id, invoice){

    const headers = {
        'Content-Type': 'application/merge-patch+json'
    }

    return Axios.patch(`${INVOICES_API}/${id}`, {...invoice, customer:  `api/customers/${invoice.customer}`}, { headers })
}

export default {
    findAll: findAll,
    find: find,
    create: createInvoice,
    update: updateInvoice,
    delete: deleteInvoice
}
