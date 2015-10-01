(function() {

    angular
            .module('openeApp.contacts')
            .controller('OrganizationController', OrganizationController);

    OrganizationController.$inject = ['$scope', '$stateParams', '$mdDialog', '$location', 
        'contactsService', 'countriesService', 'PATTERNS'];

    function OrganizationController($scope, $stateParams, $mdDialog, $location, 
    contactsService, countriesService, PATTERNS) {
        var vm = this;
        vm.doFilter = doFilter;
        vm.showOrganizationEdit = showOrganizationEdit;
        vm.deleteOrganization = deleteOrganization;
        vm.showPersonEdit = showPersonEdit;
        vm.initPersons = initPersons;
        vm.searchQuery = null;
        vm.organizations = [];
        vm.pagingParams = contactsService.createPagingParams();

        if ($stateParams.uuid) {
            //infoForm
            initInfo();
        } else {
            //list
            initList();
        }

        function initList() {
            vm.organizations.length = 0;
            contactsService.getOrganizations(vm.searchQuery, vm.pagingParams).then(function(response) {
                vm.organizations = response;
                vm.pagingParams.totalRecords = response.totalRecords;
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
                initPersons();
            });
        }

        function initPersons() {
            vm.persons.items.length = 0;
            contactsService.getAssociations(vm.organization.nodeRefId).then(function(persons) {
                vm.persons.items = persons;
            });
        }

        function doFilter(page) {
            vm.pagingParams.page = page || 1;
            initList();
        }

        function deleteOrganization(ev, organization) {
            var confirm = $mdDialog.confirm()
                    .title('Confirmation')
                    .content('Are you sure you want to delete organization?')
                    .ariaLabel('Organization delete confirmation')
                    .targetEvent(ev)
                    .ok('Yes')
                    .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                contactsService.deletePerson(organization).then(function() {
                    $location.path('/admin/organizations');
                }, function(response) {
                    console.log(response);
                    $scope.status = "Cannot delete";
                });
            });
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
            $scope.countries = countriesService.getCountries();
            $scope.PATTERNS = PATTERNS;

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
                $mdDialog.hide('Success!');
                vm.doFilter();
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
            $scope.countries = countriesService.getCountries();
            $scope.error = null;
            $scope.success = null;
            $scope.PATTERNS = PATTERNS;

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.delete = function(ev, person) {
                var confirm = $mdDialog.confirm()
                        .title('Confirmation')
                        .content('Are you sure you want to delete person contact?')
                        .ariaLabel('Person delete confirmation')
                        .targetEvent(ev)
                        .ok('Yes')
                        .cancel('Cancel');
                $mdDialog.show(confirm).then(function() {
                    contactsService.deletePerson(person)
                        .then(refreshInfoAfterSuccess, saveError);
                });
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
                vm.initPersons();
            }

            function saveError(response) {
                console.log(response);
                $scope.error = response.statusText || response.message;
            }
        }
    }

})();
