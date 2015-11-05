
    angular
        .module('openeApp.users')
        .controller('UsersController', UsersController);

    /**
     * Main Controller for the system users module
     * @param $scope
     * @constructor
     */
    function UsersController($scope, $mdDialog, $mdToast, userService, $translate) {
        var vm = this;

        vm.createUser = createUser;
        vm.deleteUser = deleteUser;
        vm.editUser = editUser;
        vm.userExists = false;

        //For the search control filter
        vm.userSearchFilters = [
            {optionLabel:"First name", optionValue:"firstName"},
            {optionLabel:"Last name", optionValue:"lastName"},
            {optionLabel:"User name", optionValue:"userName"}
        ];
        vm.optionLabel = "optionLabel";
        vm.optionValue = "optionValue";
        vm.selectOptions = vm.userSearchFilters;

        vm.filterCallback = function (query) {
            console.log(query);
            getAllSystemUsers(query);
        };
    
        populateUsersList();
        function populateUsersList() {
            getAllSystemUsers();
        }

        function createUser(ev) {
            console.log('Creating a new user');
            return showUserDialog(ev, null);
        }

        function editUser(ev, user) {
            console.log('Editing user');
            return showUserDialog(ev, user);
        }

        function deleteUser(ev, user) {
            console.log('Deleting user');

            var confirm = $mdDialog.confirm()
                .title($translate.instant('COMMON.CONFIRM'))
                .content($translate.instant('USER.ARE_YOU_SURE_YOU_WANT_TO_DELETE_USER', {user: user.firstName +" "+user.lastName+" ("+user.userName+")"}))
                .ariaLabel('')
                .targetEvent(null)
                .ok($translate.instant('COMMON.YES'))
                .cancel($translate.instant('COMMON.CANCEL'));

            $mdDialog.show(confirm).then(function() {
                userService.deleteUser(user.userName).then(function(response){
                    var responseMessage = (Object.keys(response).length == 0) ? $translate.instant('USER.DELETE_USER_SUCCESS') : $translate.instant('USER.DELETE_USER_FAILURE');
                        getAllSystemUsers();
                        $mdToast.show(
                            $mdToast.simple()
                                .content(responseMessage)
                                .position('top right')
                                .hideDelay(3000)
                        );
                })
            });

        }   

        function showUserDialog(ev, user) {
            $mdDialog.show({
                controller: 'UserDialogController',
                controllerAs: 'ucd',
                locals : {
                    user : user
                },
                templateUrl: 'app/src/users/view/userCrudDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            }).then(function onUpdateOrCreate(user, isExistingUser) {
                console.log("Then callback, user updated or edited");
                if(isExistingUser) {
                    vm.allSystemUsers = [];
                    getAllSystemUsers();
                } else {
                    vm.allSystemUsers.push(user);
                }
            }, function onCancel() {
                // Do nothing
            });
        }

        function getAllSystemUsers(query) {
            var filter = query ? query : "";
            console.log(filter);
            return userService.getPeople(filter).then(function (response) {
                console.log("Res: ", response);
                vm.allSystemUsers = response.people;
                return response;
            });
        }

    }