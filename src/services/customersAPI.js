import Axios from 'axios'

function find(id) {
    return Axios.get(`http://apicourse.myepse.be/api/customers/${id}`)
                .then(response => response.data)
}

// then ==> promesse par rapport à la réponse
function findAll(){
    return Axios.get("http://apicourse.myepse.be/api/customers")
                .then(response => response.data['hydra:member'])
}

function createCustomer(customer) {
    return Axios.post("http://apicourse.myepse.be/api/customers", customer)
}

function updateCustomer(id, customer) {
    return Axios.put(`http://apicourse.myepse.be/api/customers/${id}`, customer)

}

function deleteCustomer(id){
    return Axios.delete(`http://apicourse.myepse.be/api/customers/${id}`)
}

export default {
    find: find,
    findAll : findAll,
    create: createCustomer,
    update: updateCustomer,
    delete: deleteCustomer
}