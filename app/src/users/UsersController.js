
    angular
        .module('openeApp.users')
        .controller('UsersController', UsersController);

    /**
     * Main Controller for the system users module
     * @param $scope
     * @constructor
     */
    function UsersController($scope, $mdDialog, $mdToast, userService, $translate, sessionService, ALFRESCO_URI) {
        var vm = this;

        vm.createUser = createUser;
        vm.deleteUser = deleteUser;
        vm.editUser = editUser;
        vm.showCSVUploadDialog = showCSVUploadDialog;
        vm.userExists = false;
        vm.wcsPrefix = ALFRESCO_URI.webClientServiceProxy;

        //For the search control filter
        vm.selectOptions = [
            {optionLabel:$translate.instant('USER.USERNAME'), optionValue:"userName"},
            {optionLabel:$translate.instant('USER.FIRST_NAME'), optionValue:"firstName"},
            {optionLabel:$translate.instant('USER.LAST_NAME'), optionValue:"lastName"}
        ];

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

            if(user.userName != "admin") {
                $mdDialog.show(confirm).then(function () {
                    userService.deleteUser(user.userName).then(function (response) {
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
            } else {
                $mdDialog.show(warning);
            }

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
            }).then(function onUpdateOrCreate(user) {
                if(user.newUser) {
                    vm.allSystemUsers.push(user);
                } else {
                    vm.allSystemUsers = [];
                    getAllSystemUsers();
                }
            }, function onCancel() {
                // Do nothing
            });
        }

        function showCSVUploadDialog(){

            return $mdDialog.show({
                controller: userUploadCSVDialogController,
                templateUrl: 'app/src/users/view/usersUploadDialog.html',
                parent: angular.element(document.body),
                targetEvent: null,
                clickOutsideToClose: true,
                focusOnOpen: false
            }).then(function(){
                getAllSystemUsers();
            });
        }

        function getAllSystemUsers(query) {
            var filter = query ? query : "";
            return userService.getPeople(filter).then(function (response) {
                vm.allSystemUsers = response.people;
                return response;
            });
        }

        function userUploadCSVDialogController($scope, $translate, $mdDialog, alfrescoUploadService) {

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.upload = function(ev){
                $mdDialog.hide();

                userService.uploadUsersCSVFile($scope.fileToUpload).then(function(response){
                    var returnedUsers = response.users;
                    var failedUsers=[], msg, dlgTitle;
                    var numOfFailedUsers = response.totalUsers - response.addedUsers;
                    if(response.error == "true"){
                        dlgTitle = $translate.instant('COMMON.ERROR');
                        msg = response.message;
                    }else if (numOfFailedUsers > 0){
                        dlgTitle = $translate.instant('COMMON.ERROR');
                        //accumulate the failed users into a separate array
                        returnedUsers.forEach(function(user){
                            if(user.uploadStatus.indexOf("@") == -1)
                                failedUsers.push(user);
                        });
                        msg = $translate.instant('USER.FAILED_TO_UPLOAD_MSG',{failedNumberOfUsers: numOfFailedUsers});
                        failedUsers.forEach(function(fUser){
                            msg+= "<br/>"+fUser.username + ": "+fUser.uploadStatus;
                        });

                    } else {
                        dlgTitle = $translate.instant('COMMON.SUCCESS');
                    }

                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('body')))
                            .clickOutsideToClose(true)
                            .title(dlgTitle)
                            .textContent(msg)
                            .ariaLabel('User upload csv response.')
                            .ok("OK")
                            .targetEvent(ev)
                    );
                });
            };
        }

    }