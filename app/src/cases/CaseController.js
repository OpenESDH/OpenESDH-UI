(function(){
    'use strict';

    angular
        .module('openeApp.cases')
        .controller('CaseController', CaseController);

    CaseController.$inject = ['$scope', '$mdDialog', '$location', 'caseService', 'userService', 'caseCrudDialogService'];

    /**
     * Main Controller for the Cases module
     * @param $scope
     * @param cases
     * @constructor
     */
    function CaseController($scope, $mdDialog, $location, caseService, userService, caseCrudDialogService) {
        var vm = this;
        vm.cases = [];
        vm.caseFilter = [{
            name: 'All cases',
            value: 'all'
        },{
            name: 'Active cases',
            field: 'oe:status',
            value: 'active',
        }, {
            name: 'Closed cases',
            field: 'oe:status',
            value: 'closed',
        }, {
            name: 'Passive cases',
            field: 'oe:status',
            value: 'passive',
        }];
        vm.caseFilterChoice = vm.caseFilter[0];

        vm.getCases = getCases;
        vm.createCase = createCase;
        vm.getMyCases = getMyCases;

        activate();

        function activate() {
            getAuthorities();
            getCases();
            getMyCases();
        }

        function getCases() {
            var filters = getFilter();

            return caseService.getCases('base:case', filters).then(function(response) {
                vm.cases = response;
                return vm.cases;
            }, function(error) {
                console.log(error);
            });
        }

        function getMyCases() {
            var filters = getFilter();

            return caseService.getCases('base:case', filters).then(function(response) {
                vm.myCases = response;
                return vm.myCases;
            }, function(error) {
                console.log(error);
            });
        }

        function getFilter() {
            var filters = [];
            
            // Handling 'show all'
            if(vm.caseFilterChoice.value !== 'all') {
                filters = [{'name': vm.caseFilterChoice.field, 'operator':'=', 'value':vm.caseFilterChoice.value}];
            }

            return filters;
        }

        function createCase(ev, caseType) {
            caseCrudDialogService.createCase(caseType);
        }

        function getAuthorities() {
            return userService.getAuthorities().then(function(response) {
                vm.authorities = response;
                return response;
            });
        }
        
        function getCaseTypes() {
            return caseService.getCaseTypes().then(function(response) {
                return response;
            });
        }
  
  };
  
})();
