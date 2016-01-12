
    angular
        .module('openeApp.cases')
        .controller('CaseListController', CaseListController);

    /**
     * Main Controller for the Cases module
     * @param $scope
     * @param cases
     * @constructor
     */
    function CaseListController($controller, sessionService, $translate) {
        
        angular.extend(this, $controller('BaseCaseListController'));
        
        var vm = this;
        var userInfo = sessionService.getUserInfo();
        vm.caseFilter.unshift({
            name: $translate.instant('CASE.FILTER.MY_CASES'),
            field: 'oe:owners',
            value: userInfo.user.userName
        });
        vm.caseFilterChoice = vm.caseFilter[0];
        vm.onTabChange = onTabChange;
        vm.tab = "myCases";
                
        activate();

        function activate() {
            vm.getCases();
        }
        
        function onTabChange(tab){
            vm.tab = tab;
        }
  };