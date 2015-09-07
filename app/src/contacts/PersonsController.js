(function() {

    angular
            .module('openeApp.contacts')
            .controller('PersonsController', PersonsController);

    PersonsController.$inject = ['$mdDialog', 'contactsService'];

    function PersonsController($mdDialog, contactsService) {
        var vm = this;
        vm.persons = [];
        vm.searchQuery = '';
        vm.doFilter = doFilter;
        vm.showPersonEdit = showPersonEdit;

        initList();

        function initList() {
            vm.persons.lenght = 0;
            contactsService.getPersons(vm.searchQuery).then(function(response) {
                vm.persons = response;
            }, function(error) {
                console.log(error);
            });
        }

        function doFilter() {
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
            $scope.error = null;
            $scope.success = null;

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.delete = function() {
                contactsService.deletePerson($scope.person)
                        .then(refreshInfoAfterSuccess, saveError);
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
