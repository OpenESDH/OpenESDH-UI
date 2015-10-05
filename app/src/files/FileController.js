(function(){
    'use strict';

     angular
        .module('openeApp.files')
        .controller('FileController', FileController);

    FileController.$inject = ['$scope', 'documentService', 'fileUtilsService'];

    function FileController($scope, documentService, fileUtilsService) {
        var vm = this;

        activate();

        function activate() {
            vm.documents = documentService.getDocuments().then(function(response) {
                vm.documents = response.items;
                vm.documents.forEach(function(document){
                    document.thumbNailURL = fileUtilsService.getFileIconByMimetype(document.mimetype,24);
                });
            });
        }
    }
})();
