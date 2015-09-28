(function(){
    'use strict';

    angular
        .module('openeApp.officeTemplates')
        .controller('OfficeTemplateController', OfficeTemplateController);

    OfficeTemplateController.$inject = ['$scope', 'officeTemplateService', 'FileSaver', 'Blob'];

    /**
     * Main Controller for the Cases module
     * @param $scope
     * @param cases
     * @constructor
     */
    function OfficeTemplateController($scope, officeTemplateService, FileSaver, Blob) {
        var vm = this;

        vm.getTemplates = getTemplates;
        vm.getTemplate = getTemplate;
        vm.fillTemplate = fillTemplate;

        activate();

        function activate() {
            getTemplates();
        }

        function getTemplates() {
            return officeTemplateService.getTemplates().then(function(templates) {
                vm.templates = templates;
            });
        }

        function getTemplate(nodeRef) {
            return officeTemplateService.getTemplate(nodeRef).then(function(template) {
                return template;
            });
        }

        function fillTemplate(template, fieldData) {
            officeTemplateService.fillTemplate(template.nodeRef, fieldData).then(function (response) {
                var blob = new Blob([response.data], {
                    type: response.headers('Content-Type')
                });
                FileSaver.saveAs({
                    data: blob,
                    filename: template.name.split('.').slice(0, -1).join(".") + ".pdf"
                });
            });
        }
  }
  
})();
