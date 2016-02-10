
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
    }