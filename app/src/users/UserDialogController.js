
angular
        .module('openeApp.users')
        .controller('UserDialogController', UserDialogController);

function UserDialogController($mdDialog, $translate, $injector, notificationUtilsService, userService, user) {
    var ucd = this;

    // Data from the user creation form
    ucd.user = angular.copy(user);
    ucd.dialogMode = user ? 'USER.EDIT_USER' : 'USER.CREATE_USER';
    ucd.userExists = user ? true : false;
    ucd.cancel = cancel;
    ucd.update = update;
    ucd.clearFieldValidation = clearFieldValidation;

    // Cancel or submit form in dialog
    function cancel(form) {
        $mdDialog.cancel();
    }

    function update(u) {
        if (ucd.userExists)
            ucd.user.disableAccount = !u.enabled;
        var promise = (ucd.userExists) ? userService.updateUser(ucd.user) : userService.createUser(ucd.user);
        promise.then(function(userSaveResponse) {
            notifyUserSaved(userSaveResponse);
        }, function(error) {
            if (error.props && error.props.field) {
                ucd.userForm[error.props.field].$setDirty();
                ucd.userForm[error.props.field].$setValidity('domainError', false);
                ucd.userForm[error.props.field].$error.code = error.code;
            } else {
                notificationUtilsService.alert(error.message);
            }
        });
    }

    function notifyUserSaved(user) {
        var msg = $translate.instant('USER.USER') + ' ';
        msg += (user.cm.firstName + ' ' + user.cm.lastName).trim() + ' ';
        if (ucd.userExists) {
            msg += $translate.instant('COMMON.MODIFIED').toLowerCase();
        } else {
            msg += $translate.instant('COMMON.CREATED').toLowerCase();
        }

        $mdDialog.hide(angular.extend(user, {newUser: !ucd.userExists}));
        notificationUtilsService.notify(msg);
    }

    function clearFieldValidation(field) {
        if (!field || field.$valid)
            return;
        var errKey = Object.keys(field.$error);
        if (errKey.length > 0){
            field.$setValidity(errKey[0], true);
        }
    }
}