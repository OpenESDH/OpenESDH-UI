    angular
        .module('openeApp.files')
        .controller('FileAssigneeSelectorController', FileAssigneeSelectorController);

    function FileAssigneeSelectorController($controller, sessionService) {
        var vm = this;
        var authoritySelector = $controller('AuthoritySelectorController');
        authoritySelector.initialised().then(function(){
            var currentUser = sessionService.getUserInfo().user.userName;
            authoritySelector.authorities = authoritySelector.authorities.filter(function(item){
                return item.shortName != currentUser;
            });
            angular.extend(vm, authoritySelector);
        });
    }