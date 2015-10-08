(function () {
    'use strict';

    angular
        .module('openeApp.cases.common')
        .controller('CaseCommonDialogController', CaseCommonDialogController);
    
    function CaseCommonDialogController($mdDialog, userService, caseObj) {
        var vm = this;
        vm.scope = {parent: vm};
        if(caseObj.newCase === true){
            caseObj = {
                startDate: new Date(),
                journalKey: [],
                journalFacet: []
            };
        }
        // Data from the case creation form
        vm.case = caseObj;
        vm.editCase = (caseObj.nodeRef && caseObj.nodeRef.length > 0);
        vm.cancel = cancel;
        vm.update = update;
        vm.init = init;
        vm.getAuthorities = getAuthorities;

        function init(){
            this.getAuthorities();    
        }

        // Cancel or submit form in dialog
        function cancel(form) {
            $mdDialog.cancel();
        }
        
        function update(c) {
            $mdDialog.hide(c);
        }
        
        function getAuthorities() {
            var vm = this;
            return userService.getAuthorities().then(function(response) {
                vm.authorities = response;
                return response;
            });
        }
    }
 })();