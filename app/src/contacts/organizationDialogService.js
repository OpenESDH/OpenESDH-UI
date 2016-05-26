
angular
        .module('openeApp.contacts')
        .factory('organizationDialogService', OrganizationDialogService);

function OrganizationDialogService($mdDialog) {
    var service = {
        showOrganizationEdit: showOrganizationEdit
    };
    return service;

    function showOrganizationEdit(ev, organization, fullForm) {
        return $mdDialog.show({
            controller: DialogController,
            templateUrl: 'app/src/contacts/view/organizationCrudDialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
                organization: angular.copy(organization),
                fullForm: fullForm == undefined ? (organization == undefined ? false : true) : fullForm
            }
        }).then(function(response) {
            return response;
        });
    }

    function DialogController($scope, $mdDialog, $translate, contactsService,
            countriesService, notificationUtilsService, organization, fullForm) {
        $scope.organization = organization;
        $scope.countries = countriesService.getCountries();
        $scope.fullForm = fullForm;

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.save = function(orgForm) {
            if (!orgForm.$valid) {
                return;
            }
            if ($scope.organization.id) {
                contactsService.updateOrganization($scope.organization)
                        .then(refreshInfoAfterSuccess, error);
            } else {
                contactsService.createOrganization($scope.organization)
                        .then(refreshListAfterSuccess, error);
            }
        };

        function refreshListAfterSuccess(savedOrganization) {
            notificationUtilsService.notify($translate.instant("ORG.ORG_SAVED_SUCCESSFULLY", savedOrganization));
            $mdDialog.hide(savedOrganization);
        }

        function refreshInfoAfterSuccess(savedOrganization) {
            notificationUtilsService.notify($translate.instant("ORG.ORG_SAVED_SUCCESSFULLY", savedOrganization));
            $mdDialog.hide(savedOrganization);
        }

        function error(error) {
            if (error.domain) {
                notificationUtilsService.alert(error.message);
            }
        }
    }

}