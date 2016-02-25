
angular
        .module('openeApp.contacts')
        .factory('contactsService', contactsService);

var DEFAULT_PAGE_SIZE = 20;

function contactsService($http, $q) {
    var service = {
        //organizations
        getOrganizations: getOrganizations,
        getOrganization: getContact,
        updateOrganization: updateContact,
        createOrganization: createOrganization,
        getAssociations: getAssociations,
        deleteOrganization: deleteContact,
        getContact: getContact,
        //persons
        getPersons: getPersons,
        getPerson: getContact,
        updatePerson: updateContact,
        createPerson: createPerson,
        deletePerson: deleteContact
    };
    return service;

    //organizations
    function getOrganizations(searchTerm, pagingParams) {
        return getContacts(searchTerm, 'contact:organization', pagingParams);
    }

    function createOrganization(organization) {
        return createContact(organization, 'ORGANIZATION');
    }

    function getAssociations(parentNodeRefId) {
        return $http.get('/api/openesdh/contact?parentNodeRefId=' + parentNodeRefId)
                .then(successOrReject);
    }

    //persons
    function getPersons(searchTerm, pagingParams) {
        return getContacts(searchTerm, 'contact:person', pagingParams);
    }

    function createPerson(person) {
        return createContact(person, 'PERSON');
    }

    //contacts
    function getContacts(searchTerm, baseType, pagingParams) {
        if (pagingParams === undefined) {
            pagingParams = {
                pageSize: 15,
                page: 1,
                sortAscending: true
            };
        }
        return $http.get('/api/openesdh/contactsearch',
                {params: angular.extend({baseType: baseType, term: searchTerm || ''}, pagingParams)})
                .then(successOrReject);
    }

    function getContact(storeProtocol, storeIdentifier, uuid) {
        //api/openesdh/contact/{store_type}/{store_id}/{id}
        return $http.get('/api/openesdh/contact/' + storeProtocol + '/' + storeIdentifier + '/' + uuid)
                .then(successOrReject);
    }

    function updateContact(contact) {
        //api/openesdh/contact/{store_type}/{store_id}/{id}
        return $http.put('/api/openesdh/contact/' + contact.storeType + '/' + contact.storeId + '/' + contact.id,
                contact).then(successOrReject);
    }

    function createContact(organization, contactType) {
        ///api/openesdh/contacts/create
        return $http.post('/api/openesdh/contacts/create',
                angular.extend({contactType: contactType}, organization))
                .then(successOrReject);
    }
    function deleteContact(contact) {
        //api/openesdh/contact/{store_type}/{store_id}/{id}
        return $http.delete('/api/openesdh/contact/' + contact.storeType + '/' + contact.storeId + '/' + contact.id,
                {}).then(successOrReject);
    }

    function successOrReject(response) {
        if (response.status && response.status !== 200) {
            return $q.reject(response);
        }
        return response.data;
    }
}