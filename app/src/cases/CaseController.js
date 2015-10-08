(function(){
    'use strict';

    angular
        .module('openeApp.cases')
        .controller('CaseController', CaseController);

    CaseController.$inject = [
        '$scope',
        '$mdDialog', 
        '$location', 
        '$translate', 
        'caseService', 
        'caseCrudDialogService', 
        'alfrescoFolderService',
        'sessionService'
    ];

    /**
     * Main Controller for the Cases module
     * @param $scope
     * @param cases
     * @constructor
     */
    function CaseController($scope, $mdDialog, $location, $translate, caseService, caseCrudDialogService, alfrescoFolderService, sessionService) {
        var vm = this;
        vm.cases = [];
        vm.caseFilter = [{
            name: $translate.instant('CASE.FILTER.ALL_CASES'),
            value: 'all'
        },{
            name: $translate.instant('CASE.FILTER.ACTIVE_CASES'),
            field: 'oe:status',
            value: 'active'
        }, {
            name: $translate.instant('CASE.FILTER.CLOSED_CASES'),
            field: 'oe:status',
            value: 'closed'
        }, {
            name: $translate.instant('CASE.FILTER.PASSIVE_CASES'),
            field: 'oe:status',
            value: 'passive'
        }];
        vm.caseFilterChoice = vm.caseFilter[0];

        vm.getCases = getCases;
        vm.createCase = createCase;
        vm.getMyCases = getMyCases;
        vm.deleteCase = deleteCase;
        vm.isAdmin = sessionService.isAdmin();
        vm.registeredCaseTypes = caseCrudDialogService.getRegisteredCaseTypes();

        activate();

        function activate() {
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

        function getCaseTypes() {
            return caseService.getCaseTypes().then(function(response) {
                return response;
            });
        }
        
        function deleteCase(caseObj){
            var confirm = $mdDialog.confirm()
                .title($translate.instant('COMMON.CONFIRM'))
                .content($translate.instant('CASE.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THE_CASE', {case_title: caseObj["cm:title"]}))
                .ariaLabel('')
                .targetEvent(null)
                .ok($translate.instant('COMMON.YES'))
                .cancel($translate.instant('COMMON.CANCEL'));
            $mdDialog.show(confirm).then(function() {
                alfrescoFolderService.deleteFolder(caseObj.nodeRef).then(function(result){
                   setTimeout(getCases, 500); 
                });
            });
        }
  
  };
  
})();
