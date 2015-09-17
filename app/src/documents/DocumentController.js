(function(){
    
    angular
        .module('openeApp.documents')
        .controller('DocumentController', DocumentController);
    
    DocumentController.$inject = [
        '$scope',
        '$stateParams',
        '$mdDialog',
        'caseDocumentsService',
        'documentPreviewService',
        'caseDocumentFileDialogService',
        'casePartiesService',
        'caseService'
    ];
    
    function DocumentController($scope, $stateParams, $mdDialog, caseDocumentsService, documentPreviewService, caseDocumentFileDialogService, casePartiesService, caseService) {

        var caseId = $stateParams.caseId;
        var vm = this;
        vm.caseId = caseId;
        vm.pageSize = 10;
        
        vm.loadDocuments = loadDocuments;
        vm.uploadDocument = uploadDocument;
        vm.previewDocument = previewDocument;
        vm.emailDocuments = emailDocuments;
        vm.noDocuments = noDocuments;

        activate();
        
        function activate(){
            loadDocuments(1);
        }
        
        function loadDocuments(page){
            var res = caseDocumentsService.getDocumentsByCaseId(caseId, page, vm.pageSize);
            res.then(function(response) {
                vm.documents = response.documents;
                vm.contentRange = response.contentRange;
                var pages = [];
                var pagesCount = Math.ceil(response.contentRange.totalItems / vm.pageSize); 
                for(var i=0; i < pagesCount; i++){
                    pages.push(i+1);
                }
                vm.pages = pages;
            });
        }
        
        function uploadDocument(){
            caseDocumentFileDialogService.uploadCaseDocument(caseId).then(function(result){
                loadDocuments(1); 
            });
        }
        
        function previewDocument(nodeRef){
            documentPreviewService.previewDocument(nodeRef);
        }

        function emailDocuments() {
            caseDocumentsService.getDocumentsByCaseId(vm.caseId, 1, 100).then(function(response) {
                vm.docs = response.documents;
                $mdDialog.show({
                    templateUrl: '/app/src/documents/view/emailDialog.html',
                    controller: EmailDocumentsDialogController,
                    controllerAs: 'vm',
                    clickOutsideToClose: true,
                    locals: {
                        docs: vm.docs,
                        caseId: vm.caseId
                    }
                });
            });
        }

        EmailDocumentsDialogController.$inject = ['$mdDialog', 'docs', 'caseId'];

        function EmailDocumentsDialogController($mdDialog, docs, caseId) {
            var vm = this;

            vm.documents = docs;
            vm.caseId = caseId;
            vm.emailDocuments = emailDocuments;
            vm.cancel = cancel;
            vm.querySearch = querySearch;
            vm.filterSelected = true;

            activate()

            function activate() {
                casePartiesService.getCaseParties(caseId).then(function(response) {
                    vm.parties = response;
                    vm.to = [];
                })
            }

            function querySearch(query) {
                var results = query ? vm.parties.filter(createFilterFor(query)) : [];
                return results;
            }

            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(party) {
                    return (party.displayName.toLowerCase().indexOf(lowercaseQuery) != -1);
                };
            }
            function emailDocuments() {
                // Send the email
                console.log('to', vm.to);

                caseService.sendEmail(caseId, {
                    'to': vm.to,
                    'subject': vm.subject,
                    'message': vm.message,
                    'documents': vm.documents.filter(function(document) {
                        return document.selected;
                    })
                });
                $mdDialog.hide();
            }

            function cancel(form) {
                $mdDialog.cancel();
            }
        }

        function noDocuments() {
            return typeof vm.documents === 'undefined' || vm.documents.length === 0;
        }
    }

})();
