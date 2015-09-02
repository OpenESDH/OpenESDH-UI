(function () {
    'use strict';

    angular.module('openeApp.organizations').factory('organizationService', organizationService);

    organizationService.$inject = ['$http', '$resource'];

    function organizationService($http, $resource) {
        var service = {
            getOrganizations: getOrganizations,
            getOrganization: getOrganization
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
            return $http.get('/alfresco/service/api/openesdh/contact/'+storeProtocol+'/'+storeIdentifier+'/' + uuid)
                    .then(getOrganization);

            function getOrganization(response) {
                return response.data;
            }
        }

    }
})();
