
    angular
        .module('openeApp.contacts')
        .controller('OrganizationController', OrganizationController);

    function OrganizationController($stateParams, $mdDialog, $location, $translate, VirtualRepeatLoader,
            contactsService, countriesService, notificationUtilsService, oeParametersService) {
        
        var vm = this;
        vm.showOrganizationEdit = showOrganizationEdit;
        vm.deleteOrganization = deleteOrganization;
        
        vm.allowNewContacts = false;
        oeParametersService.getParameter('can_create_contacts').then(function(value){
            vm.allowNewContacts = value;
        });

        if ($stateParams.uuid) {
            //infoForm
            initInfo();
        } else {
            //list
            initList();
        }

        function initList() {
            vm.dataLoader = new VirtualRepeatLoader(contactsService.getOrganizations, error);
        }

        function initInfo() {
            contactsService.getOrganization($stateParams.storeProtocol, $stateParams.storeIdentifier, $stateParams.uuid).then(function(organization) {
                vm.organization = organization;
            });
        }

        function deleteOrganization(ev, organization) {
            var confirm = $mdDialog.confirm()
                    .title($translate.instant('COMMON.CONFIRM'))
                    .textContent($translate.instant('ORG.ARE_YOU_SURE_YOU_WANT_TO_DELETE_ORG', organization))
                    .targetEvent(ev)
                    .ok($translate.instant('COMMON.YES'))
                    .cancel($translate.instant('COMMON.CANCEL'));
            $mdDialog.show(confirm).then(function() {
                contactsService.deleteOrganization(organization).then(function() {
                    $location.path('/admin/organizations');
                    notificationUtilsService.notify($translate.instant("ORG.ORG_DELETED_SUCCESSFULLY", organization));
                }, error);
            });
        }

        function showOrganizationEdit(ev) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'app/src/contacts/view/organizationCrudDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    organization: angular.copy(vm.organization)
                }
            })
            .then(function(response) {
                //
            });
        }

        function DialogController($scope, $mdDialog, organization) {
            $scope.organization = organization;
            $scope.countries = countriesService.getCountries();

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.save = function(orgForm) {
                if (!orgForm.$valid) return;
                
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
                vm.dataLoader.refresh();
                $mdDialog.hide();
            }

            function refreshInfoAfterSuccess(savedOrganization) {
                notificationUtilsService.notify($translate.instant("ORG.ORG_SAVED_SUCCESSFULLY", savedOrganization));
                vm.organization = savedOrganization;
                $mdDialog.hide();
            }
        }

        function error(response) {
            notificationUtilsService.alert(response.data.message);
        }
    };