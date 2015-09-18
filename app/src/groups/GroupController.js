(function(){
    'use strict';

    angular
        .module('openeApp.groups')
        .controller('GroupController', GroupController);

    GroupController.$inject = ['$scope', '$mdDialog'];

    /**
     * Main Controller for the Groups module
     * @param $scope
     * @constructor
     */
    function GroupController($scope, $mdDialog) {
        var vm = this;
        
    };
  
})();
