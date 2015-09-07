(function() {

    angular
            .module('openeApp.contacts')
            .controller('OrganizationController', OrganizationController);

    OrganizationController.$inject = ['$scope', '$stateParams', '$mdDialog', 'contactsService', 'alfrescoNodeUtils'];

    function OrganizationController($scope, $stateParams, $mdDialog, contactsService, alfrescoNodeUtils) {
        var vm = this;
        vm.showOrganizationEdit = showOrganizationEdit;
        vm.showPersonEdit = showPersonEdit;

        if ($stateParams.uuid) {
            //infoForm
            initInfo();
        } else {
            //list
            initList();
        }

        function initList() {
            vm.organizations = [];
            contactsService.getOrganizations(vm.searchQuery || '').then(function(response) {
                vm.organizations = response;
            }, function(error) {
                console.log(error);
            });
        }

        function initInfo() {
            contactsService.getOrganization($stateParams.storeProtocol, $stateParams.storeIdentifier, $stateParams.uuid).then(function(organization) {
                vm.organization = organization;
                vm.persons = {
                    items: []
                };
                contactsService.getAssociations(organization.nodeRefId).then(function(persons) {
                    vm.persons.items = persons;
                });

            });

        }

        function doFilter() {
            initList();
        }

        function showOrganizationEdit(ev) {
            $scope.status = null;
            $mdDialog
                    .show({
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
                        $scope.status = response;
                    }, function() {

                    });
        }

        function DialogController($scope, $mdDialog, organization) {
            $scope.organization = organization;

            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.save = function(orgForm) {
                if (!orgForm.$valid) {
                    $scope.error = 'Fill all required fields!';
                    return;
                }
                $scope.error = null;
                if ($scope.organization.id) {
                    contactsService.updateOrganization($scope.organization)
                            .then(refreshInfoAfterSuccess, saveError);
                } else {
                    contactsService.createOrganization($scope.organization)
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


        function showPersonEdit(ev, person) {
            $mdDialog
                    .show({
                        controller: PersonDialogController,
                        templateUrl: 'app/src/contacts/view/personCrudDialog.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        locals: {
                            person: angular.copy(person)
                        }
                    })
                    .then(function(response) {
                        console.log(response);
                    }, function() {

                    });
        }

        function PersonDialogController($scope, $mdDialog, person) {
            if (!person) {
                person = {
                    parentNodeRefId: vm.organization.nodeRefId
                };
            }
            $scope.person = person;
            $scope.error = null;
            $scope.success = null;

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.save = function(personForm) {
                vm.error = null;
                vm.success = null;
                if (!personForm.$valid) {
                    vm.error = 'Fill all required fields!';
                    return;
                }
                if ($scope.person.id) {
                    contactsService.updatePerson($scope.person)
                            .then(refreshInfoAfterSuccess, saveError);
                } else {
                    contactsService.createPerson($scope.person)
                            .then(refreshInfoAfterSuccess, saveError);
                }
            };

            function refreshInfoAfterSuccess(savedPerson) {
                $mdDialog.hide('Success!');
            }

            function saveError(response) {
                console.log(response);
                $scope.error = response.statusText || response.message;
            }
        }
    }

})();
