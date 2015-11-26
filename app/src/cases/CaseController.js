
    angular
        .module('openeApp.cases')
        .controller('CaseController', CaseController);

    /**
     * Main Controller for the Cases module
     * @param $scope
     * @param cases
     * @constructor
     */
    function CaseController($controller, sessionService) {
        
        angular.extend(this, $controller('BaseCaseController'))
        
        var vm = this;
        
        var superGetFilter = vm.getFilter;
        vm.getFilter = getFilter;
        vm.superGetFilter = superGetFilter;
        vm.onTabChange = onTabChange;
        vm.tab = "myCases";
                
        activate();

        function activate() {
            vm.getCases();
        }
        
        function getFilter() {
            var filters = vm.superGetFilter();
            var userInfo = sessionService.getUserInfo();
            filters.push({
                name: "oe:owners",
                value: userInfo.user.userName,
                operator: "="
            });
            return filters;
        }
        
        function onTabChange(tab){
            vm.tab = tab;
        }
  };