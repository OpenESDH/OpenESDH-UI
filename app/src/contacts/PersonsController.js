(function() {

    angular
            .module('openeApp.contacts')
            .controller('PersonsController', PersonsController);

    PersonsController.$inject = ['$mdDialog', 'contactsService', 'countriesService'];
    
    var DEFAULT_PAGE_SIZE = 5;

    function PersonsController($mdDialog, contactsService, countriesService) {
        var vm = this;
        vm.doFilter = doFilter;
        vm.showPersonEdit = showPersonEdit;
        vm.persons = [];
        vm.searchQuery = null;
        vm.pages = [];
        vm.pagingParams = {
            pageSize: DEFAULT_PAGE_SIZE,
            page: 1,
            totalRecords: 0,
            sortField: null,
            sortAscending: true
        };

        initList();

        function initList() {
            vm.persons.length = 0;
            contactsService.getPersons(vm.searchQuery).then(function(response) {
                vm.persons = response;
                initPages(response);
            }, function(error) {
                console.log(error);
            });
        }
        
        function initPages(response) {
            vm.pages.length = 0;
            vm.pagingParams.totalRecords = response.totalRecords;
            var pagesCount = Math.ceil(response.totalRecords / vm.pagingParams.pageSize);
            for (var i = 0; i < pagesCount; i++) {
                vm.pages.push(i + 1);
            }
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
