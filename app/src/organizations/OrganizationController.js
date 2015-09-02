(function() {
    'use strict';

    angular
            .module('openeApp.organizations')
            .controller('OrganizationController', OrganizationController)
            .run(function(authService, $q) {
                // This is just a hack, until we get a login page
                $q.resolve(authService.login('admin', 'openeadmin'));
            });

    OrganizationController.$inject = ['$scope', '$mdDialog', 'organizationService'];

    function OrganizationController($scope, $mdDialog, organizationService) {
        var vm = this;
        vm.organizations = [];
        vm.searchQuery = '';

        vm.getOrganizations = getOrganizations;

        activate();

        function activate() {
            getOrganizations(vm.searchQuery).then(function() {

            });
        }

        function getOrganizations(searchQuery) {
            return organizationService.getOrganizations(searchQuery).then(function(response) {
                vm.organizations = response;
                return vm.organizations;
            }, function(error) {
                console.log(error);
            });
        }



        $scope.showAdvanced = function(ev) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'app/src/organizations/view/organizationCrudDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            })
                    .then(function(answer) {
                        $scope.status = 'You said the information was "' + answer + '".';
                    }, function() {
                        $scope.status = 'You cancelled the dialog.';
                    });
        };

    }
    ;

    function DialogController($scope, $mdDialog) {
        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
    }
    ;

})();
