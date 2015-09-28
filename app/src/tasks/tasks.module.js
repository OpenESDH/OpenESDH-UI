(function(){
    'use strict';
    angular.module('openeApp.tasks', [ 
        'ngMaterial', 
        'openeApp.tasks.common', 
        'openeApp.adhoc.tasks', 
        'openeApp.activitiReview.tasks',
        'openeApp.activitiParallelReview.tasks'
    ]);
})();
