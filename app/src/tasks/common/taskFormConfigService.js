
    angular
        .module('openeApp.tasks.common')
        .provider('taskFormConfigService', TaskFormConfigServiceProvider);

    function TaskFormConfigServiceProvider(){
        var serviceConfig = [];
        
        this.taskForm = taskForm;
        
        this.$get = TaskFormConfigService;
        
        function taskForm(taskFormConfig){
            serviceConfig.push(taskFormConfig);
            return this;
        }
        
        function TaskFormConfigService() {
            return {
                getTaskFormConfig : getTaskFormConfig
            };
            
            function getTaskFormConfig(taskName){
                for(var i in serviceConfig){
                    var taskForm = serviceConfig[i];
                    if(taskForm.taskName == taskName){
                        return taskForm;
                    }
                }
                return null;
            }
        } // end of service
    } // end of provider