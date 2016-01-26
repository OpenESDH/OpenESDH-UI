
angular
        .module('openeApp')
        .controller('AuthoritySelectorController', AuthoritySelectorController);

function AuthoritySelectorController(userService) {
    var vm = this;
    vm.groups = [];
    vm.users = [];
    userService.getAuthorities().then(function(response) {
        vm.groups = filterSelectableWithType(response, 'cm:authorityContainer');
        vm.users = filterSelectableWithType(response, 'cm:person');
    });

    function filterSelectableWithType(authorities, type){
        return authorities.filter(function(item){
            return item.selectable && item.type === type;
        });
    }

}