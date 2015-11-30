
angular
    .module('openeApp')
    .controller('AuthController', AuthController);

function AuthController($scope, $state, $stateParams, $translate, authService, userService, $mdDialog) {
    var vm = this;
    var loginErrorMessage = angular.fromJson($stateParams.error);

    vm.login = login;
    vm.logout = logout;
    vm.loggedin = loggedin;
    vm.getUserInfo = getUserInfo;
    vm.errorMsg = loginErrorMessage ? loginErrorMessage: "";
    vm.showForgotDialog = showForgotDialog;
    vm.updateValidator = updateValidator;

    function login(credentials) {
        authService.login(credentials.username, credentials.password).then(function(response) {

            // Logged in
            if(response.userName) {
                userService.getPerson(credentials.username).then(function (response) {
                    vm.user = response;
                    $state.go('dashboard');
                });
            }

            // If incorrect values            
            if(response.status == 403) {
                vm.form.password.$setValidity("loginFailure", false);
            }

        });
    }

    function logout() {
        authService.logout().then(function(response) {
            delete vm.user;
            $state.go('login');
        });
    }

    function loggedin() {
        return authService.loggedin();
    }

    function updateValidator () {
        if(vm.form.password.$error.loginFailure)
            vm.form.password.$setValidity("loginFailure", true);
    }

    function forgotPasswordCtrl($scope, $mdDialog) {
        var dlg = this;
        dlg.emailSent = false;

        dlg.cancel = function() {
            return $mdDialog.cancel();
        };

        dlg.updateValidators = function() {
            if(dlg.form.email.$error.emailNotExists)
                dlg.form.email.$setValidity("emailNotExists", true);
        };

        dlg.forgotPassword = function() {
            if(!dlg.email) return;

            authService.changePassword(dlg.email).then(
                
                function success(response) {
                    dlg.emailSent = true;
                }, 
                
                function onError(response) {
                    // If email doesn't exist in system
                    if( response.status !== 200 )
                        dlg.form.email.$setValidity("emailNotExists", false);
                }
            ); 
        }


    };

    function showForgotDialog(ev) {
        $mdDialog.show({
            controller: forgotPasswordCtrl,
            controllerAs: 'dlg',
            templateUrl: 'app/src/authentication/view/forgotPasswordDialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        });
    }

    function getUserInfo() {
        var userInfo = authService.getUserInfo();
        return userInfo;
    }
}