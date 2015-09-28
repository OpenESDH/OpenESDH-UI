(function(){

    
    angular.module('openeApp.tasks.common')
        .controller('simpleTaskController', simpleTaskController);
    
    simpleTaskController.$inject = ['$controller'];
    
    function simpleTaskController($controller) {
        angular.extend(this, $controller('baseTaskController', {}));
        var vm = this;
        
        init();
        
        function init(){
            vm.init();
        }
        
    }

})();
