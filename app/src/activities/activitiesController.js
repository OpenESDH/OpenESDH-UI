angular
    .module('openeApp.activities')
    .controller('activitiesController', activitiesController);

function activitiesController(activitiesService) {
    var vm = this;
    vm.activities = [];

    vm.filterArray = {};
    vm.columnFilter = columnFilter;

    vm.activityTypes = [{
        name: "Case",
        value: "dk.openesdh.case-update"
    },{
        name: "Case member",
        value: "dk.openesdh.case.member"
    },{
        name: "Document",
        value: "dk.openesdh.case.document"
    },{
        name: "Workflow",
        value: "dk.openesdh.case.Workflow"
    }];

    activitiesService.getUserActivities().then(function(result) {
        angular.forEach(result, function(activity, key) {
            activity.activitySummary = angular.fromJson(activity.activitySummary);
        });
        vm.activities = result;
        if (result.length > 0) {
            activitiesService.setCurrentUserLastReadActivityFeedId(result[0].id);
        }
    });

    function columnFilter(item) {
        if (vm.filterArray.id) {
            var searchText = new RegExp(vm.filterArray.id, "i");
            var id = item.activitySummary.caseId;
            if (id.search(searchText) < 0)
                return;
        }

        if (vm.filterArray.title) {
            var searchText = new RegExp(vm.filterArray.title, "i");
            var title = item.activitySummary.caseTitle;
            if (title.search(searchText) < 0)
                return;
        }

        if (vm.filterArray.performer) {
            var searchText = new RegExp(vm.filterArray.performer, "i");
            var performer = item.activitySummary.modifierDisplayName;
            if (performer.search(searchText) < 0)
                return;
        }


        if (vm.filterArray.date !== undefined) {
            if (!vm.filterArray.date)
                return item;
            var d1a = Date.parse(vm.filterArray.date);
            var d1b = d1a + (24 * 60 * 60 * 1000);
            var d2 = item.postDate;
            if (!(d2 >= d1a && d2 < d1b))
                return;
        }

        if (vm.filterArray.type && vm.filterArray.type.length > 0) {
            var arr = vm.filterArray.type;
            var isInList = false;
            for (var i = 0; i < arr.length; i++){
                if (item["activityType"].indexOf(arr[i]) > -1) {
                    isInList = true;
                    break;
                }
            }
            if (!isInList) return;
        }

        return item;
    }
}
