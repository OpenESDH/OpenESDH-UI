    angular
        .module('openeApp.tasks')
        .controller('tasksOverviewController', TasksOverviewController);

    function TasksOverviewController($filter, taskService) {
        var vm = this;
        vm.tasks = [];
        vm.filterArray = {};
        vm.columnFilter = columnFilter;

        vm.taskPriorities = [{
            name: "High",
            value: 1
        }, {
            name: "Medium",
            value: 2
        }, {
            name: "Low",
            value: 3
        }];

        vm.taskStatuses = [{
            name: "Not Yet Started",
            value: "Not Yet Started"
        }, {
            name: "In Progres",
            value: "In Progres"
        }, {
            name: "On Hold",
            value: "On Hold"
        }, {
            name: "Cancelled",
            value: "Cancelled"
        }, {
            name: "Completed",
            value: "Completed"
        }];

        loadTasks();

        function loadTasks() {
            taskService.getTasks().then(function(result) {
                vm.tasks = result;
            });
        }

        function columnFilter(item) {
            if (vm.filterArray.taskName !== undefined) {
                var searchText = new RegExp(vm.filterArray.taskName, "i");
                var taskName = item.properties.bpm_description;
                if (taskName.search(searchText) < 0)
                    return;
            }

            if (vm.filterArray.description !== undefined) {
                var searchText = new RegExp(vm.filterArray.description, "i");
                var description = $filter('taskDescription')(item);
                if (description.search(searchText) < 0)
                    return;
            }

            if (vm.filterArray.status && vm.filterArray.status.length > 0) {
                var arr = vm.filterArray.status;
                if (arr.indexOf(item.properties.bpm_status) < 0)
                    return;
            }

            if (vm.filterArray.dueDate !== undefined) {
                if (!vm.filterArray.dueDate)
                    return item;
                var d1 = new Date(vm.filterArray.dueDate);
                var d2 = new Date(item.properties.bpm_dueDate);
                if (d1.getTime() !== d2.getTime())
                    return;
            }

            if (vm.filterArray.performer !== undefined) {
                var searchText = new RegExp(vm.filterArray.performer, "i");
                var performer = item.owner ? (item.owner.firstName + " " + item.owner.lastName) : '';
                if (performer.search(searchText) < 0)
                    return;
            }


            if (vm.filterArray.priority && vm.filterArray.priority.length > 0) {
                var arr = vm.filterArray.priority;
                if (arr.indexOf(item.properties.bpm_priority) < 0)
                    return;
            }

            return item;
        }

    }
