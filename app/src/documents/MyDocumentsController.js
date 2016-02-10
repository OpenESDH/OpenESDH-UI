    angular
        .module('openeApp.documents')
        .controller('MyDocumentsController', MyDocumentsController);
    
    function MyDocumentsController($controller, documentService){
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
                vm.documents = response.items;
                vm.addThumbnailUrl();
            });
        }
    }