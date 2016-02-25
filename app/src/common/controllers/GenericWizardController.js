
    angular
        .module('openeApp')
        .controller('GenericWizardController', GenericWizardController);

    function GenericWizardController($mdDialog) {
        var vm = this;
        vm.forms = [];
        vm.nestedForms = [];
        vm.appendForm = appendForm;
        vm.isValid = isValid;
        vm.cancel = cancel;
        vm.querySearch = querySearch;
        vm.selectedItemChange = selectedItemChange;
        
        function appendForm(form){
            var vm = this;
            vm.forms.push(form);
        }
        
        function cancel(){
            $mdDialog.cancel();
        }

        function isValid(currentStep){
            var vm = this;
            if(vm.forms[currentStep] === undefined){
                return true;
            }
            return vm.forms[currentStep].$valid;
        }

        function selectedItemChange(item) {
            vm.datasource = item ? item.nodeRef : '';
        }

        function querySearch(query) {
            var results = query ? vm.list.filter(createFilterFor(query)) : vm.list;
            return results;
        }

        /*
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item) {
                return (item.name.toLowerCase().indexOf(lowercaseQuery) > -1);
            };
        }

    }