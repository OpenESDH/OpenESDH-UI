
    angular
        .module('openeApp.tasks.common')
        .controller('simpleTaskController', simpleTaskController);
    
    function simpleTaskController($controller) {
        angular.extend(this, $controller('baseTaskController', {}));
        var vm = this;
        
        init();
        
        function init(){
            vm.init();
        }
        
    }