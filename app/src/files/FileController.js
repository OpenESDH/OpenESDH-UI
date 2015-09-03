(function(){
    'use strict';

     angular
        .module('openeApp.files')
        .controller('FileController', FileController);

    FileController.$inject = ['$scope', 'documentService'];

    function FileController($scope, documentService) {
        var vm = this;

        activate();

        function activate() {
            vm.documents = documentService.getDocuments().then(function(response) {
                console.log(response);
                vm.documents = response.items;
            });
        }
    }
})();
