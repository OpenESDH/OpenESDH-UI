
    angular
        .module('openeApp')
        .filter('taskTitle', taskTitleFactory);
    
    function taskTitleFactory($injector){
        function taskTitleFilter(task) {
            if(task == undefined || task == null){
                return '';
            }
            if($injector.has(task.name + 'TitleFilter')){
                var titleFilter = $injector.get(task.name + 'TitleFilter');
                return titleFilter(task);
            }
            return task.properties.bpm_description;            
        }
        return taskTitleFilter;
    }