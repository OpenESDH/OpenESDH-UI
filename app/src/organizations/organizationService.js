(function() {
    'use strict';

    angular.module('openeApp.organizations').factory('organizationService', organizationService);

    organizationService.$inject = ['$http', '$q'];

    function organizationService($http, $q) {
        var service = {
            getOrganizations: getOrganizations,
            getOrganization: getOrganization,
            updateOrganization: updateOrganization,
            createOrganization: createOrganization
        };
        return service;

        function getOrganizations(searchTerm) {
            return $http.get('/alfresco/service/api/openesdh/contactsearch',
                    {params: {baseType: 'contact:organization', term: searchTerm}})
                    .then(successOrReject);
        }

        function getOrganization(storeProtocol, storeIdentifier, uuid) {
            //api/openesdh/contact/{store_type}/{store_id}/{id}
            return $http.get('/alfresco/service/api/openesdh/contact/' + storeProtocol + '/' + storeIdentifier + '/' + uuid)
                    .then(successOrReject);
        }

        function updateOrganization(storeProtocol, storeIdentifier, uuid, organization) {
            //api/openesdh/contact/{store_type}/{store_id}/{id}
            return $http.put('/alfresco/service/api/openesdh/contact/' + storeProtocol + '/' + storeIdentifier + '/' + uuid,
                    organization).then(successOrReject);
        }

        function createOrganization(organization) {
            ///api/openesdh/contacts/create
            return $http.post('/alfresco/service/api/openesdh/contacts/create',
                    angular.extend({contactType: 'ORGANIZATION'}, organization))
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
