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
        'userService', 
        'caseCrudDialogService', 
        'alfrescoFolderService'
    ];

    /**
     * Main Controller for the Cases module
     * @param $scope
     * @param cases
     * @constructor
     */
    function CaseController($scope, $mdDialog, $location, $translate, caseService, userService, caseCrudDialogService, alfrescoFolderService) {
        var vm = this;
        vm.cases = [];

        vm.getCases = getCases;
        vm.createCase = createCase;
        vm.getMyCases = getMyCases;
        vm.deleteCase = deleteCase;

        activate();

        function activate() {
            getAuthorities();
            getCases();
            getMyCases();
        }

        function getCases() {
            return caseService.getCases('base:case').then(function(response) {
                vm.cases = response;
                return vm.cases;
            }, function(error) {
                console.log(error);
            });
        }

        function getMyCases() {
            var filters = [{'name': 'oe:status', 'operator':'=', 'value':'active'}];
            return caseService.getCases('base:case', filters).then(function(response) {
                vm.myCases = response;
                return vm.myCases;
            }, function(error) {
                console.log(error);
            });
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
