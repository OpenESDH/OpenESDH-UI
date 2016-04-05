
angular
        .module('openeApp.users')
        .controller('UserDialogController', UserDialogController);

function UserDialogController($scope, $mdDialog, $mdToast, $translate, $injector, $timeout, notificationUtilsService, userService, user) {
    var ucd = this;

    // Data from the user creation form
    ucd.user = angular.copy(user);
    ucd.dialogMode = user ? 'USER.EDIT_USER' : 'USER.CREATE_USER';
    ucd.userExists = user ? true : false;
    ucd.cancel = cancel;
    ucd.update = update;
    ucd.clearFieldValidation = clearFieldValidation;
    ucd.useAddo = $injector.has('addoService');
    ucd.isAddoConfigured = false;

    if (ucd.useAddo) {
        var addoService = $injector.get('addoService');
        if (ucd.userExists) {
            addoService.getAddoUserProperties(user.userName).then(function(addoProps) {
                ucd.user.addoUsername = addoProps.addoUsername;
            });
        }
    }

    // When the form is submitted, show a notification:
    ucd.toastPosition = {
        bottom: false,
        top: true,
        left: false,
        right: true
    };

    // Cancel or submit form in dialog
    function cancel(form) {
        $mdDialog.cancel();
    }

    function update(u) {
        if (ucd.userExists)
            ucd.user.disableAccount = !u.enabled;
        var promise = (ucd.userExists) ? userService.updateUser(ucd.user) : userService.createUser(ucd.user);
        promise.then(function(userSaveResponse) {
            if (ucd.useAddo && ucd.user.addoPassword) {
                addoService
                        .saveAddoUser(ucd.user.userName, ucd.user.addoUsername, ucd.user.addoPassword)
                        .then(function() {
                            notifyUserSaved(userSaveResponse);
                        }, function(response) {
                            ucd.userExists = true;
                            handleCreateEditError(response);
                        });
            } else {
                notifyUserSaved(userSaveResponse);
            }
        }, handleCreateEditError)
                .then(function() {
                    userService.setEmailFeedDisabled(ucd.user);
                });
    }



    function getToastPosition() {
        return Object.keys(ucd.toastPosition)
                .filter(function(pos) {
                    return ucd.toastPosition[pos];
                })
                .join(' ');
    }

    function notifyUserSaved(user) {
        var msg = $translate.instant('USER.USER') + ' ';
        msg += user.firstName + ' ' + user.lastName + ' ';
        if (ucd.userExists) {
            msg += $translate.instant('COMMON.MODIFIED').toLowerCase();
        } else {
            msg += $translate.instant('COMMON.CREATED').toLowerCase();
        }

        $mdDialog.hide(angular.extend(user, {newUser: !ucd.userExists}));
        $mdToast.show(
                $mdToast.simple()
                .content(msg)
                .position(getToastPosition())
                .hideDelay(3000)
                );
    }

    function handleCreateEditError(response) {
        var error;
        console.log(response);

        if (response.data && response.data.error && response.data.error.message) {
            error = response.data.error;
        } else if (response.status === 404) {
            notificationUtilsService.notify($translate.instant('ERROR.UNEXPECTED_ERROR'));
            return;
        }

        // If conflict
        if (response.status === 409) {
            // Username already exists
            if (error.message.indexOf('User name already exists') > -1) {
                ucd.userForm.userName.$setValidity('usernameExists', false);
                return;
            }
        }

        if (response.status === 500) {
            // Email already exists
            if (error.message.indexOf('Error updating email: already exists') > -1 ||
                    error.message.indexOf('Email must be unique and already exists') > -1) {
                ucd.userForm.email.$setValidity('emailExists', false);
                return;
            }

            //domain errors:
            if (error.domain) {
                if (error.code === 'ADDO.USER.INCORECT_PASSWORD') {
                    ucd.userForm.addoUsername.$setDirty();
                    ucd.userForm.addoUsername.$setValidity('incorrectAddoPass', false);
                    ucd.userForm.addoPassword.$setDirty();
                    ucd.userForm.addoPassword.$setValidity('incorrectAddoPass', false);
                    return;
                }
            }
        }
        notificationUtilsService.notify($translate.instant('ERROR.UNEXPECTED_ERROR'));
    }

    function clearFieldValidation(field) {
        if (field.$valid)
            return;
        if (field.$error.usernameExists)
            field.$setValidity('usernameExists', true);
        if (field.$error.emailExists)
            field.$setValidity('emailExists', true);
        if (field.$error.incorrectAddoPass)
            field.$setValidity('incorrectAddoPass', true);
    }
}