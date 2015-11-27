
    angular
        .module('openeApp.cases')
        .controller('GroupCasesController', GroupCasesController);

    /**
     * Controller for the Group Cases
     * @param $scope
     * @param cases
     * @constructor
     */
    function GroupCasesController($controller, userService, caseService, documentPreviewService) {
        
        angular.extend(this, $controller('BaseCaseController'))
        
        var vm = this;
        
        var superGetFilter = vm.getFilter;
        vm.getFilter = getFilter;
        vm.superGetFilter = superGetFilter;
        vm.getCases = getCases;
        vm.previewDocument = previewDocument;
                
        activate();

        function activate() {
            userService.getCurrentUserCaseOwnersGroups().then(function(result){
                vm.currentUserCaseOwnersGroups = result;
                vm.getCases();
            })
        }
        
        function getCases() {
            var vm = this;
            var filters = vm.getFilter();
            return caseService.getGroupCases('base:case', filters).then(function(response) {
                vm.cases = response;
                return vm.cases;
            }, function(error) {
                console.log(error);
            });
        }
        
        function getFilter() {
            var filters = vm.superGetFilter();
            filters.push({
                name: "oe:owners",
                value: vm.currentUserCaseOwnersGroups,
                operator: "IN"
            });
            return filters;
        }
        
        function previewDocument(nodeRef){
            documentPreviewService.previewDocument(nodeRef);
        }
  };