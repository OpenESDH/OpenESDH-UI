    angular
        .module('openeApp.tasks')
        .controller('tasksOverviewController', TasksOverviewController);

    function TasksOverviewController($filter, $translate, taskService) {
        var vm = this;
        vm.tasks = [];
        vm.displayHeader = true;
        vm.filterArray = {};
        vm.columnFilter = columnFilter;

        vm.taskPriorities = [{
            name: $translate.instant('WORKFLOW.TASK.PRIORITY.1'),
            value: 1
        }, {
            name: $translate.instant('WORKFLOW.TASK.PRIORITY.2'),
            value: 2
        }, {
            name: $translate.instant('WORKFLOW.TASK.PRIORITY.3'),
            value: 3
        }];

        vm.taskStatuses = [{
            name: $translate.instant('WORKFLOW.TASK.STATUS.NotYetStarted'),
            value: "Not Yet Started"
        }, {
            name: $translate.instant('WORKFLOW.TASK.STATUS.InProgres'),
            value: "In Progres"
        }, {
            name: $translate.instant('WORKFLOW.TASK.STATUS.OnHold'),
            value: "On Hold"
        }, {
            name: $translate.instant('WORKFLOW.TASK.STATUS.Cancelled'),
            value: "Cancelled"
        }, {
            name: $translate.instant('WORKFLOW.TASK.STATUS.Completed'),
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
