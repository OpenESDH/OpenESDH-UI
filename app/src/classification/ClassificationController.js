(function () {
    'use strict';

    angular
        .module('openeApp.classification')
        .controller('ClassificationController', ClassificationController);

    ClassificationController.$inject = ['$scope', 'classificationService'];

    function ClassificationController($scope, classificationService) {

        var vm = this;
        vm.search = search;

        function search(query, field) {
            return classificationService.search(query, field).then(function (response) {
                return response.map(function (item) {
                    item.value = item.nodeRef;
                    return item;
                });
            });
        }
    }

})();
