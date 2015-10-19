
    angular
        .module('openeApp')
        .controller('ApplicationController', ApplicationController);

    function ApplicationController() {
        var vm = this;

        vm.currentUser;
        vm.setCurrentUser = setCurrentUser;

        function setCurrentUser(user) {
            vm.currentUser = user;
        }
    }