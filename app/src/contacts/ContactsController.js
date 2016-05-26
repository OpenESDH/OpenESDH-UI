angular
        .module('openeApp.contacts')
        .controller('ContactsController', ContactsController);

function ContactsController($scope) {
    $scope.hideHeader = true;
    initTab();

    function initTab() {
        $scope.$on('$stateChangeSuccess', function(event, toState) {
            $scope.currentTab = toState.data.selectedTab;
        });
    }
}