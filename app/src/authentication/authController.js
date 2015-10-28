
angular
    .module('openeApp')
    .controller('AuthController', AuthController);

function AuthController($scope, $state, authService, userService, $mdDialog) {
    var vm = this;

    vm.login = login;
    vm.logout = logout;
    vm.loggedin = loggedin;
    vm.getUserInfo = getUserInfo;
    vm.showForgotDialog = showForgotDialog;

    function login(credentials) {
        authService.login(credentials.username, credentials.password).then(function(response) {
            userService.getPerson(credentials.username).then(function(response) {
                vm.user = response;
            });
            console.log('tostate: ' + $scope.returnToState);
            if ($scope.returnToState) {
                $state.go($scope.returnToState.name, $scope.returnToStateParams);
            } else {
                $state.go('dashboard');
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

    function forgotPasswordCtrl($scope, $mdDialog) {
        var dlg = this;
        dlg.emailSent = false;

        dlg.cancel = function() {
            return $mdDialog.cancel();
        }

        dlg.updateValidators = function() {
            if(dlg.form.email.$error.notExist)
                delete dlg.form.email.$error.notExist;
        }

        dlg.forgotPassword = function() {
            if(!dlg.email) return;

            authService.changePassword(dlg.email).then(
                
                function success(response) {
                    dlg.emailSent = true;
                }, 
                
                function onError(response) {
                    // If email doesn't exist in system
                    if( response.status === 404 ){
                        dlg.form.email.$setDirty();
                        dlg.form.email.$error.notExist = true;
                    }
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