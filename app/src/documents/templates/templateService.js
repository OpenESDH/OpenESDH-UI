
angular
        .module('openeApp')
        .factory('templateService', TemplateService);

function TemplateService(ALFRESCO_URI, $http, $resource) {
    return {
        uploadTemplate: uploadTemplate
    };

    function uploadTemplate(formData) {
        var tmplFileData = new FormData();
        tmplFileData.append("filedata", formData.fileToUpload);
        tmplFileData.append("filename", formData.fileToUpload.name);
        angular.forEach(formData.templateProperties, function (value, key) {
            tmplFileData.append(key, value);
        });

        return $http.post('/alfresco/service/api/openesdh/officetemplate', tmplFileData, {
            transformRequest: angular.identity, headers: {'Content-Type': undefined}
        }).then(function(response) {
            return response.data;
        });
    }
}
