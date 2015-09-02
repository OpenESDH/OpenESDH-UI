(function() {

    angular
            .module('openeApp.organizations')
            .controller('OrganizationInfoController', OrganizationInfoController);

    OrganizationInfoController.$inject = ['$scope', '$routeParams', '$mdDialog', 'organizationService'];

    function OrganizationInfoController($scope, $routeParams, $mdDialog, organizationService) {
        var vm = this;
        init();

        function init() {
            organizationService.getOrganization($routeParams.storeProtocol, $routeParams.storeIdentifier, $routeParams.uuid).then(function(response) {
                vm.organization = response;
            });
        }

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
                if ($routeParams.uuid) {
                    organizationService.updateOrganization(
                            $routeParams.storeProtocol, $routeParams.storeIdentifier, $routeParams.uuid,
                            $scope.organization).then(saveSuccess, saveError);
                        }

                function saveSuccess(savedOrganization) {
                    vm.organization = savedOrganization;
                    $mdDialog.hide('Success!');
                }
                
                function saveError(response) {
                    $scope.error = response.statusText || response.message;
                }

            };
        }
    }


})();
