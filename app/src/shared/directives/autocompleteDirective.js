
angular
    .module('openeApp')
    .directive('openeAutocomplete', autocomplete);

function autocomplete(){

    return {
        restrict: 'E',
        scope: {
            datasource: '=',
            required: '=',
            name: '@',
            list: '=',
            label: '@'
        },
        controllerAs: 'vm',
        controller: '@',
        name: 'controllerName',
      	bindToController: true,
        templateUrl: 'app/src/common/components/authoritySelector/view/authoritySelectorOptions.html'
    }
}