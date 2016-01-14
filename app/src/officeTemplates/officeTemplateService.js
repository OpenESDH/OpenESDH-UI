
    angular
        .module('openeApp.officeTemplates')
        .factory('officeTemplateService', officeTemplateService);

    function officeTemplateService($http, userService, alfrescoNodeUtils, sessionService, ALFRESCO_URI) {

        var lastFetch = 0;

        return {
            getTemplates: getTemplates,
            deleteTemplate: deleteTemplate,
            getTemplate: getTemplate,
            fillTemplate: fillTemplate,
            uploadTemplate: uploadTemplate,
            getCardViewThumbnail: getCardViewThumbnail
        };

        function getTemplates() {
            return $http.get('/api/openesdh/officetemplates').then(function (response) {
                return response.data;
            });
        }

        function getTemplate(nodeRef) {
            return $http.get('/api/openesdh/officetemplates/' + alfrescoNodeUtils.processNodeRef(nodeRef).uri).then(function (response) {
                return response.data;
            });
        }

        /**
         * Deletes a template given its noderef
         * @param nodeRef
         * @returns {*}
         */
        function deleteTemplate(nodeRef) {
            return $http.delete('/api/openesdh/officeDocTemplate/' + alfrescoNodeUtils.processNodeRef(nodeRef).uri).then(function (response) {
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
            return $http.post('/api/openesdh/officetemplates/' + alfrescoNodeUtils.processNodeRef(nodeRef).uri + "/fill",
                {fieldData: fieldData},
                {responseType: 'arraybuffer'}
            ).then(function (response) {
                return new Blob([response.data], {
                    type: response.headers('Content-Type')
                });
            });
        }

        function uploadTemplate(formData) {
            var tmplFileData = new FormData();
            tmplFileData.append("filedata", formData.fileToUpload);
            tmplFileData.append("filename", formData.fileToUpload.name);
            angular.forEach(formData.templateProperties, function (value, key) {
                tmplFileData.append(key, value);
            });

            return $http.post('/api/openesdh/officeDocTemplate', tmplFileData, {
                transformRequest: angular.identity, headers: {'Content-Type': undefined}
            }).then(function(response) {
                return response.data;
            });
        }

        function getTime() {
            var cur = new Date().getTime();
            if(cur - lastFetch > 5000) lastFetch = cur;
            return lastFetch;
        }

        function getCardViewThumbnail (nodeRef, thumbnailName){
            var nodeRefAsLink = nodeRef.replace(":/", ""),
                noCache = "&noCache=" + getTime(),
                force = "c=force";
            return ALFRESCO_URI.webClientServiceProxy + "/api/node/" + nodeRefAsLink + "/content/thumbnails/"+(thumbnailName ? thumbnailName : "cardViewThumbnail") + "?" + force + noCache;
        }
    }