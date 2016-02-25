
angular
        .module('openeApp.documents')
        .controller('CaseDocumentsController', CaseDocumentsController);

function CaseDocumentsController($controller, $stateParams, caseDocumentsService) {

    angular.extend(this, $controller('DocumentsController'));
    
    var caseId = $stateParams.caseId;
    var vm = this;
    vm.docDetailsUrl = '#/cases/case/' + caseId + '/doc';
    vm.caseId = caseId;
    vm.pageSize = 10;

    vm.reloadDocuments = reloadDocuments;
    vm.loadDocumentsByCase = loadDocumentsByCase;
    vm.init = init;
    vm.init();

    function reloadDocuments(){
        this.loadDocumentsByCase();
    }
    
    function init() {
        this.loadDocumentsByCase();
        var vm = this;        
        caseDocumentsService.getDocumentsFolderNodeRef(caseId).then(function(res){
            vm.docsFolderNodeRef = res.caseDocsFolderNodeRef;
        });
    }

    function loadDocumentsByCase(page) {
        var vm = this;
        if (page == undefined) {
            page = 1;
        }
        caseDocumentsService.getDocumentsByCaseId(caseId, page, vm.pageSize).then(function(response) {
            vm.documents = response.documents;
            vm.contentRange = response.contentRange;
            vm.addThumbnailUrl();
            var pages = [];
            var pagesCount = Math.ceil(response.contentRange.totalItems / vm.pageSize);
            for (var i = 0; i < pagesCount; i++) {
                pages.push(i + 1);
            }
            vm.pages = pages;
        });
    }
}
