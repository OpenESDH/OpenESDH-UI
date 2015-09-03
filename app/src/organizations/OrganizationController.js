(function() {

    angular
            .module('openeApp.organizations')
            .controller('OrganizationController', OrganizationController)
            .run(function(authService, $q) {
                // This is just a hack, until we get a login page
                $q.resolve(authService.login('admin', 'openeadmin'));
            });

    OrganizationController.$inject = ['$scope', '$stateParams', '$mdDialog', 'organizationService'];

    function OrganizationController($scope, $stateParams, $mdDialog, organizationService) {
        var vm = this;
        
        if ($stateParams.uuid) {
            //infoForm
            initInfo();
        } else {
            //list
            initList();
        }

        function initList() {
            vm.organizations = [];
            organizationService.getOrganizations(vm.searchQuery || '').then(function(response) {
                vm.organizations = response;
            }, function(error) {
                console.log(error);
            });
        }
        
        function initInfo() {
            organizationService.getOrganization($stateParams.storeProtocol, $stateParams.storeIdentifier, $stateParams.uuid).then(function(response) {
                vm.organization = response;
            });
        }
        
        function doFilter(){
            initList();
        };
        
        $scope.doFilter = doFilter;

        $scope.showAdvanced = function(ev) {
            $scope.status = null;
            $mdDialog
                    .show({
                        controller: DialogController,
                        templateUrl: 'app/src/organizations/view/organizationCrudDialog.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        locals: {
                            organization: angular.copy(vm.organization)
                        }
                    })
                    .then(function(answer) {
                        $scope.status = answer;
                    }, function() {

                    });
        };

        function DialogController($scope, $mdDialog, organization) {
            $scope.organization = organization;
            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.answer = function(orgForm) {
                if (!orgForm.$valid) {
                    $scope.error = 'Fill all required fields!';
                    return;
                }
                $scope.error = null;
                if ($stateParams.uuid) {
                    organizationService.updateOrganization(
                            $stateParams.storeProtocol, $stateParams.storeIdentifier, $stateParams.uuid, $scope.organization)
                            .then(refreshInfoAfterSuccess, saveError);
                } else {
                    organizationService.createOrganization($scope.organization)
                            .then(refreshListAfterSuccess, saveError);
                }
            };

            function refreshListAfterSuccess() {
                doFilter();
                $mdDialog.hide('Success!');
            }
            
            function refreshInfoAfterSuccess(savedOrganization) {
                vm.organization = savedOrganization;
                $mdDialog.hide('Success!');
            }

            function saveError(response) {
                console.log(response);
                $scope.error = response.statusText || response.message;
            }
        }
    }


})();
