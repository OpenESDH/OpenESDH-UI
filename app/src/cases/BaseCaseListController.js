
angular
        .module('openeApp.cases')
        .controller('BaseCaseListController', BaseCaseListController);

/**
 * Main Controller for the Cases module
 * @param $scope
 * @param cases
 * @constructor
 */
function BaseCaseListController($mdDialog, $translate, caseService, alfrescoFolderService, sessionService,
        notificationUtilsService) {

    var vm = this;
    vm.cases = [];
    vm.caseFilter = [{
            name: $translate.instant('CASE.FILTER.ALL_CASES'),
            value: 'all'
        }, {
            name: $translate.instant('CASE.FILTER.ACTIVE_CASES'),
            field: 'oe:status',
            value: 'active'
        }, {
            name: $translate.instant('CASE.FILTER.CLOSED_CASES'),
            field: 'oe:status',
            value: 'closed'
        }, {
            name: $translate.instant('CASE.FILTER.PASSIVE_CASES'),
            field: 'oe:status',
            value: 'passive'
        }];
    vm.caseFilterChoice = vm.caseFilter[0];

    vm.getCases = getCases;
    vm.deleteCase = deleteCase;
    vm.isAdmin = sessionService.isAdmin();
    vm.getFilter = getFilter;
    vm.filterArray = {};
    vm.columnFilter = columnFilter;

    function getCases() {
        var vm = this;
        var filters = vm.getFilter();
        return caseService.getCases('base:case', filters).then(function(response) {
            vm.cases = response;
            return vm.cases;
        }, function(error) {
            console.log(error);
        });
    }

    function getFilter() {
        var vm = this;
        var filters = [];

        // Handling 'show all'
        if (vm.caseFilterChoice.value !== 'all') {
            filters = [{'name': vm.caseFilterChoice.field, 'operator': '=', 'value': vm.caseFilterChoice.value}];
        }

        return filters;
    }

    function getCaseTypes() {
        return caseService.getCaseTypes().then(function(response) {
            return response;
        });
    }

    function deleteCase(caseObj) {
        var vm = this;
        var confirm = $mdDialog.confirm()
                .title($translate.instant('COMMON.CONFIRM'))
                .textContent($translate.instant('CASE.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THE_CASE', {case_title: caseObj["cm:title"]}))
                .ariaLabel('')
                .targetEvent(null)
                .ok($translate.instant('COMMON.YES'))
                .cancel($translate.instant('COMMON.CANCEL'));
        $mdDialog.show(confirm).then(function() {
            alfrescoFolderService.deleteFolder(caseObj.nodeRef).then(function(response) {
                notificationUtilsService.notify($translate.instant('CASE.DELETE_CASE_SUCCESS'));
                setTimeout(getCases.bind(vm), 500);
            });
        });
    }

    function columnFilter(item) {
        if (vm.filterArray.caseName) {
            var searchText = new RegExp(vm.filterArray.caseName, "i");
            var caseName = item["cm:title"];
            if (caseName.search(searchText) < 0)
                return;
        }

        if (vm.filterArray.id) {
            var searchText = new RegExp(vm.filterArray.id, "i");
            var caseId = item["oe:id"];
            if (caseId.search(searchText) < 0)
                return;
        }

        if (vm.filterArray.type && vm.filterArray.type.length > 0) {
            var arr = vm.filterArray.type;
            if (arr.indexOf(item["TYPE"]) < 0)
                return;
        }

        if (vm.filterArray.created !== undefined) {
            if (!vm.filterArray.created)
                return item;
            var d1a = Date.parse(vm.filterArray.created);
            var d1b = d1a + (24 * 60 * 60 * 1000);
            var d2 = item["cm:created"];
            if (!(d2 >= d1a && d2 < d1b))
                return;
        }

        if (vm.filterArray.creator) {
            var searchText = new RegExp(vm.filterArray.creator, "i");
            var creator = item["cm:creator"];
            if (creator.search(searchText) < 0)
                return;
        }

        if (vm.filterArray.modified !== undefined) {
            if (!vm.filterArray.modified)
                return item;
            var d1a = Date.parse(vm.filterArray.modified);
            var d1b = d1a + (24 * 60 * 60 * 1000);
            var d2 = item["cm:modified"];
            if (!(d2 >= d1a && d2 < d1b))
                return;
        }

        if (vm.filterArray.status && vm.filterArray.status.length > 0) {
            var arr = vm.filterArray.status;
            if (arr.indexOf(item["oe:status"]) < 0)
                return;
        }

        return item;
    }

}