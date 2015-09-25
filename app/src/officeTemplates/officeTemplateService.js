(function () {
    'use strict';

    angular
        .module('openeApp.officeTemplates')
        .factory('officeTemplateService', officeTemplateService);

    officeTemplateService.$inject = ['$http', 'userService', 'alfrescoNodeUtils'];

    function officeTemplateService($http, userService, alfrescoNodeUtils) {
        return {
            getTemplates: getTemplates,
            getTemplate: getTemplate,
            fillTemplate: fillTemplate
        };

        function getTemplates() {
            return $http.get('/alfresco/service/api/openesdh/officetemplates').then(function (response) {
                return response.data;
            });
        }

        function getTemplate(nodeRef) {
            return $http.get('/alfresco/service/api/openesdh/officetemplates/' + alfrescoNodeUtils.processNodeRef(nodeRef).uri).then(function (response) {
                return response.data;
            });
        }

        function fillTemplate(nodeRef, fieldData) {
            return $http.post('/alfresco/service/api/openesdh/officetemplates/' + alfrescoNodeUtils.processNodeRef(nodeRef).uri + "/fill",
                {fieldData: fieldData},
                {responseType: 'arraybuffer'}
            );
        }
    }
})();
