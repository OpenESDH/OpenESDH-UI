(function() {
    'use strict';

    angular
            .module('openeApp.contacts')
            .factory('contactsService', contactsService);

    contactsService.$inject = ['$http', '$q'];

    function contactsService($http, $q) {
        var service = {
            //organizations
            getOrganizations: getOrganizations,
            getOrganization: getContact,
            updateOrganization: updateContact,
            createOrganization: createOrganization,
            //persons
            getPersons: getPersons,
            getPerson: getContact,
            updatePerson: updateContact,
            createPerson: createPerson
        };
        return service;
        
        //organizations
        function getOrganizations(searchTerm) {
            return getContacts(searchTerm, 'contact:organization');
        }
        
        function createOrganization(organization) {
            return createContact(organization, 'ORGANIZATION');
        }
        
        //persons
        function getPersons(searchTerm) {
            return getContacts(searchTerm, 'contact:person');
        }
        
        function createPerson(organization) {
            return createContact(organization, 'PERSON');
        }
        
        //contacts
        function getContacts(searchTerm, baseType) {
            return $http.get('/alfresco/service/api/openesdh/contactsearch',
                    {params: {baseType: baseType, term: searchTerm}})
                    .then(successOrReject);
        }

        function getContact(storeProtocol, storeIdentifier, uuid) {
            //api/openesdh/contact/{store_type}/{store_id}/{id}
            return $http.get('/alfresco/service/api/openesdh/contact/' + storeProtocol + '/' + storeIdentifier + '/' + uuid)
                    .then(successOrReject);
        }

        function updateContact(storeProtocol, storeIdentifier, uuid, contact) {
            //api/openesdh/contact/{store_type}/{store_id}/{id}
            return $http.put('/alfresco/service/api/openesdh/contact/' + storeProtocol + '/' + storeIdentifier + '/' + uuid,
                    contact).then(successOrReject);
        }
        
        function createContact(organization, contactType) {
            ///api/openesdh/contacts/create
            return $http.post('/alfresco/service/api/openesdh/contacts/create',
                    angular.extend({contactType: contactType}, organization))
                    .then(successOrReject);
        }

        function successOrReject(response) {
            if (response.status && response.status !== 200) {
                return $q.reject(response);
            }
            return response.data;
        }
    }
})();
