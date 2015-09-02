(function() {

    angular
            .module('openeApp.organizations')
            .controller('OrganizationInfoController', OrganizationInfoController);

    OrganizationInfoController.$inject = ['$scope', '$routeParams', '$mdDialog', 'organizationService'];

    function OrganizationInfoController($scope, $routeParams, $mdDialog, organizationService) {
        init();

        function init() {
            organizationService.getOrganization($routeParams.storeProtocol, $routeParams.storeIdentifier, $routeParams.uuid).then(function(response) {
                $scope.organization = response;
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
