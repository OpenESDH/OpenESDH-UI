
    angular
        .module('openeApp')
        .filter('taskDescription', taskDescriptionFactory);
    
    function taskDescriptionFactory(){
        function taskDescriptionFilter(task) {
            if(task == undefined || task == null){
                return '';
            }
            return (task.description != task.properties.bpm_description) && (task.description != "") ? task.description : task.workflowInstance.message;            
        }
        return taskDescriptionFilter;
    }