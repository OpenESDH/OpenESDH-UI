
    angular
        .module('openeApp.cases')
        .controller('GroupCasesController', GroupCasesController);

    /**
     * Controller for the Group Cases
     * @param $scope
     * @param cases
     * @constructor
     */
    function GroupCasesController($controller, userService, caseService, documentPreviewService, $mdDialog) {
        
        angular.extend(this, $controller('BaseCaseController'))
        
        var vm = this;
        
        var superGetFilter = vm.getFilter;
        vm.getFilter = getFilter;
        vm.superGetFilter = superGetFilter;
        vm.getCases = getCases;
        vm.previewDocument = previewDocument;
        vm.assignTo = assignTo;
                
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
        
        function assignTo(caseObj){
            getAuthorities(caseObj.TYPE).then(function(authorities){
                $mdDialog.show({
                    controller: CaseAssignToDialogController,
                    controllerAs: 'dlg',
                    templateUrl: 'app/src/cases/view/caseAssignToDialog.html',
                    parent: angular.element(document.body),
                    targetEvent: null,
                    clickOutsideToClose: true,
                    locals: {
                        authorities: authorities
                    },
                    focusOnOpen: false
                }).then(function(assign_to){
                    var props = {
                        assoc_base_owners_added: assign_to,
                        assoc_base_owners_removed: caseObj['base:owners'][0].nodeRef
                    };
                    caseService.updateCase(caseObj.nodeRef, props).then(function(result){
                        vm.getCases();
                    });
                });    
            });
            
        }
        
        function getAuthorities(type) {
            var caseType = type;
            return userService.getCaseAuthorities(caseType.split(':')[0].toUpperCase());
        }
        
        function CaseAssignToDialogController($mdDialog, authorities){
            var vm = this;
            vm.authorities = authorities;
            
            vm.cancel = function() {
                $mdDialog.cancel();
            };
            
            vm.assign = function(){
                $mdDialog.hide(vm.assign_to);
            }
        }
  };