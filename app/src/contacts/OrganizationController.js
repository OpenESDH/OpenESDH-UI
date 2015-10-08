
    angular
        .module('openeApp.contacts')
        .controller('OrganizationController', OrganizationController);

    function OrganizationController($scope, $stateParams, $mdDialog, $location, $translate,
            contactsService, countriesService, PATTERNS, notificationUtilsService) {
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
            }, error);
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
                    .title($translate.instant('COMMON.CONFIRM'))
                    .content($translate.instant('ORG.ARE_YOU_SURE_YOU_WANT_TO_DELETE_ORG', organization))
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
                        //
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
                    notificationUtilsService.notify($translate.instant("COMMON.FILL_ALL_REQUIRED_FIELDS"));
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
                vm.doFilter();
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
            $scope.PATTERNS = PATTERNS;

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.delete = function(ev, person) {
                var confirm = $mdDialog.confirm()
                        .title($translate.instant('COMMON.CONFIRM'))
                        .content($translate.instant('CONTACT.ARE_YOU_SURE_YOU_WANT_TO_DELETE_PERSON_CONTACT', person))
                        .targetEvent(ev)
                        .ok($translate.instant('COMMON.YES'))
                        .cancel($translate.instant('COMMON.CANCEL'));
                $mdDialog.show(confirm).then(function() {
                    contactsService.deletePerson(person).then(function(){
                        refreshInfoAfterSuccessWithMsg($translate.instant("CONTACT.CONTACT_DELETED_SUCCESSFULLY", person));
                    }, error);
                });
            };

            $scope.save = function(personForm) {
                if (!personForm.$valid) {
                    notificationUtilsService.notify($translate.instant("COMMON.FILL_ALL_REQUIRED_FIELDS"));
                    return;
                }
                if ($scope.person.id) {
                    contactsService.updatePerson($scope.person)
                            .then(refreshInfoAfterSave, error);
                } else {
                    contactsService.createPerson($scope.person)
                            .then(refreshInfoAfterSave, error);
                }
            };

            function refreshInfoAfterSave(savedPerson) {
                refreshInfoAfterSuccessWithMsg($translate.instant("CONTACT.CONTACT_SAVED_SUCCESSFULLY", savedPerson));
            }

            function refreshInfoAfterSuccessWithMsg(msg) {
                notificationUtilsService.notify(msg);
                vm.initPersons();
                $mdDialog.hide();
            }
        }
    };