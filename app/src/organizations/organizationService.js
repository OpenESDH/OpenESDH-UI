(function() {
    'use strict';

    angular.module('openeApp.organizations').factory('organizationService', organizationService);

    organizationService.$inject = ['$http', '$resource', '$q'];

    function organizationService($http, $resource, $q) {
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
                    .then(getOrganizations);

            function getOrganizations(response) {
                return response.data;
            }
        }

        function getOrganization(storeProtocol, storeIdentifier, uuid) {
            //api/openesdh/contact/{store_type}/{store_id}/{id}
            return $http.get('/alfresco/service/api/openesdh/contact/' + storeProtocol + '/' + storeIdentifier + '/' + uuid)
                    .then(getOrganization);

            function getOrganization(response) {
                return response.data;
            }
        }

        function updateOrganization(storeProtocol, storeIdentifier, uuid, organization) {
            //api/openesdh/contact/{store_type}/{store_id}/{id}
            return $http.put('/alfresco/service/api/openesdh/contact/' + storeProtocol + '/' + storeIdentifier + '/' + uuid,
                    organization).then(updateOrganizationComplete);

            function updateOrganizationComplete(response) {
                if (response.status && response.status !== 200) {
                    return $q.reject(response);
                }
                return response.data;
            }
        }

        function createOrganization(organization) {
            return $resource('/alfresco/service/api/openesdh/contact/' + storeProtocol + '/' + storeIdentifier + '/' + uuid,
                    {type: 'contact:organization'}).save(organization, createOrganizationComplete);

            function createOrganizationComplete(response) {
                return response;
            }
        }



    }
})();
