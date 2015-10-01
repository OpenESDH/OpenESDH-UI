(function() {

    angular
            .module('openeApp.contacts')
            .controller('PersonsController', PersonsController);

    PersonsController.$inject = ['$mdDialog', 'contactsService', 'countriesService', 'PATTERNS'];

    

    function PersonsController($mdDialog, contactsService, countriesService, PATTERNS) {
        var vm = this;
        vm.doFilter = doFilter;
        vm.showPersonEdit = showPersonEdit;
        vm.persons = [];
        vm.searchQuery = null;
        vm.pagingParams = contactsService.createPagingParams();

        initList();

        function initList() {
            vm.persons.length = 0;
            contactsService.getPersons(vm.searchQuery, vm.pagingParams).then(function(response) {
                vm.persons = response;
                vm.pagingParams.totalRecords = response.totalRecords;
            }, function(error) {
                console.log(error);
            });
        }

        function doFilter(page) {
            vm.pagingParams.page = page || 1;
            initList();
        }

        function showPersonEdit(ev, person) {
            $mdDialog
                    .show({
                        controller: DialogController,
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

        function DialogController($scope, $mdDialog, person) {
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
                vm.doFilter();
            }

            function saveError(response) {
                console.log(response);
                $scope.error = response.statusText || response.message;
            }
        }
    }
})();
