angular
    .module('openeApp.cases')
    .controller('CaseListController', CaseListController);

/**
 * Main Controller for the Cases module
 * @param $scope
 * @param cases
 * @constructor
 */
function CaseListController($filter, $controller, sessionService, $translate) {

    angular.extend(this, $controller('BaseCaseListController'));

    var vm = this;
    var userInfo = sessionService.getUserInfo();
    vm.caseFilter.unshift({
        name: $translate.instant('CASE.FILTER.MY_CASES'),
        field: 'oe:owners',
        value: userInfo.user.userName
    });
    vm.caseFilterChoice = vm.caseFilter[0];
    vm.onTabChange = onTabChange;
    vm.tab = "myCases";

    vm.caseTypes = [{
        value: "simple:case",
        name: $filter('caseType')("simple:case")
    }, {
        value: "staff:case",
        name: $filter('caseType')("staff:case")
    }];
    vm.caseStatuses = [{
        value: "active",
        name: $translate.instant('CASE.FILTER.ACTIVE_CASES')
    }, {
        value: "closed",
        name: $translate.instant('CASE.FILTER.CLOSED_CASES')
    }, {
        value: "passive",
        name: $translate.instant('CASE.FILTER.PASSIVE_CASES')
    }];

    activate();

    function activate() {
        vm.getCases();
    }

    function onTabChange(tab) {
        vm.tab = tab;
    }
};
