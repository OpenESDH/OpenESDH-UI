
angular
        .module('openeApp.users')
        .controller('UsersController', UsersController);

/**
 * Main Controller for the system users module
 * @param $scope
 * @constructor
 */
function UsersController($mdDialog, notificationUtilsService, userService, $translate) {
    var vm = this;

    vm.createUser = createUser;
    vm.deleteUser = deleteUser;
    vm.editUser = editUser;
    vm.showCSVUploadDialog = showCSVUploadDialog;
    vm.userExists = false;

    //For the search control filter
    vm.selectOptions = [
        {optionLabel: $translate.instant('USER.USERNAME'), optionValue: "userName"},
        {optionLabel: $translate.instant('USER.FIRST_NAME'), optionValue: "firstName"},
        {optionLabel: $translate.instant('USER.LAST_NAME'), optionValue: "lastName"}
    ];

    vm.filterCallback = function(query) {
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
                .textContent($translate.instant('USER.ARE_YOU_SURE_YOU_WANT_TO_DELETE_USER', {
                    user: user.firstName + " " + user.lastName + " (" + user.userName + ")"
                }))
                .ariaLabel('')
                .targetEvent(ev)
                .ok($translate.instant('COMMON.YES'))
                .cancel($translate.instant('COMMON.CANCEL'));

        var warning = $mdDialog.confirm()
                .title($translate.instant('COMMON.WARNING'))
                .textContent($translate.instant('USER.CAN_NOT_DELETE_ADMIN_USER'))
                .ariaLabel('')
                .targetEvent(ev)
                .ok($translate.instant('COMMON.OK'));

        if (user.userName != "admin") {
            $mdDialog.show(confirm).then(function() {
                userService.deleteUser(user.userName).then(function(response) {
                    var responseMessage = (Object.keys(response).length == 0) ? $translate.instant('USER.DELETE_USER_SUCCESS') : $translate.instant('USER.DELETE_USER_FAILURE');
                    getAllSystemUsers();
                    notificationUtilsService.notify(responseMessage);
                });
            });
        } else {
            $mdDialog.show(warning);
        }

    }

    function showUserDialog(ev, user) {
        if (user) {
            userService.getUserInfo(user.userName).then(function(userInfo) {
                _showUserDialog(ev, userInfo);
            });
        } else {
            _showUserDialog(ev);
        }
    }

    function _showUserDialog(ev, userInfo) {
        $mdDialog.show({
            controller: 'UserDialogController',
            controllerAs: 'ucd',
            locals: {
                user: userInfo
            },
            templateUrl: 'app/src/users/view/userCrudDialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        }).then(function onUpdateOrCreate(user) {
            vm.allSystemUsers = [];
            getAllSystemUsers();
        });
    }

    function showCSVUploadDialog() {

        return $mdDialog.show({
            controller: userUploadCSVDialogController,
            templateUrl: 'app/src/users/view/usersUploadDialog.html',
            parent: angular.element(document.body),
            targetEvent: null,
            clickOutsideToClose: true,
            focusOnOpen: false
        }).then(function() {
            getAllSystemUsers();
        });
    }

    function getAllSystemUsers(query) {
        var filter = query ? query : "";
        return userService.getPeople(filter).then(function(response) {
            vm.allSystemUsers = response.people;
            return response;
        });
    }

    function userUploadCSVDialogController($scope, $translate, $mdDialog, ALFRESCO_URI) {

        $scope.wcsPrefix = ALFRESCO_URI.webClientServiceProxy;

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.upload = function(ev) {
            $mdDialog.hide();

            userService.uploadUsersCSVFile($scope.fileToUpload).then(function(response) {
                var numOfFailedUsers = response.totalUsers - response.createdUsers;
                if (response.totalUsers === 0) {
                    notificationUtilsService.alert($translate.instant('USER.ERRORS.CSV_EMPTY'));
                }
                if (numOfFailedUsers > 0) {
                    var htmlContent = '<p>' + $translate.instant('USER.CSV_SUCCESSFULLY_IMPORTED', response)
                            + '</p><div>' + $translate.instant('USER.ERRORS.FAILED_TO_UPLOAD_' + (numOfFailedUsers === 1 ? '1' : 'N'),
                                    {failedNumberOfUsers: numOfFailedUsers})
                            + '</div><ul class=\'csv-import-error-li\'>';
                    response.users.forEach(function(user) {
                        if (user.error) {
                            htmlContent += '<li>' + $translate.instant(user.error, user) + '</li>';
                        }
                    });
                    htmlContent += '</ul>';

                    $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('body')))
                            .clickOutsideToClose(true)
                            .title($translate.instant('USER.ERRORS.CSV_IMPORT_ERRORS'))
                            .htmlContent(htmlContent)
                            .ariaLabel('User upload csv response.')
                            .ok("OK")
                            .targetEvent(ev)
                            );
                    return;
                }
                notificationUtilsService.notify($translate.instant('USER.CSV_SUCCESSFULLY_IMPORTED', response));
            }, function(error) {
                if (error.domain) {
                    notificationUtilsService.alert(error.message);
                }
            });
        };
    }

}