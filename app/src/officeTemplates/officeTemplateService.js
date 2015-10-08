
    angular
        .module('openeApp.officeTemplates')
        .factory('officeTemplateService', officeTemplateService);

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

        /**
         * Fill the given template with the field data.
         *
         * The return value is a promise which returns a Blob containing
         * the filled in template.
         * @param nodeRef
         * @param fieldData
         * @returns {*}
         */
        function fillTemplate(nodeRef, fieldData) {
            return $http.post('/alfresco/service/api/openesdh/officetemplates/' + alfrescoNodeUtils.processNodeRef(nodeRef).uri + "/fill",
                {fieldData: fieldData},
                {responseType: 'arraybuffer'}
            ).then(function (response) {
                return new Blob([response.data], {
                    type: response.headers('Content-Type')
                });
            });
        }
    }