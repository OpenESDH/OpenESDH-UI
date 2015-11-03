angular
    .module('openeApp.docTemplates')
    .controller('templatesController', TemplatesController);

function TemplatesController() {
    var vm = this;
    vm.templates = [];

    vm.statuses = function loadTemplates() {
        alert("Template controller");
    }

}
