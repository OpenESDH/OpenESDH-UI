    angular
        .module('openeApp.documents')
        .controller('MyDocumentsController', MyDocumentsController);
    
    function MyDocumentsController($controller, documentService, alfrescoNodeUtils){
        angular.extend(this, $controller('DocumentsController'));
        var vm = this;
        vm.loadMyDocuments = loadMyDocuments;
        vm.reloadDocuments = reloadDocuments;
        vm.loadMyDocuments();
        
        function reloadDocuments(){
            this.loadMyDocuments();
        }
        
        function loadMyDocuments() {
            var vm = this;
            vm.documents = documentService.getDocuments().then(function(response) {
                vm.documents = response.items.filter(function(doc){
                    return doc.location.path.indexOf('/OpenESDH/cases/') === 0;//starts with
                }).map(function(doc){
                    var caseId = doc.location.path.split('/')[6];//caseId
                    doc['caseId'] = caseId;
                    doc['docNodeRef'] = alfrescoNodeUtils.processNodeRef(doc.location.parent.nodeRef);
                    return doc;
                });
                vm.addThumbnailUrl();
            });
        }
    }