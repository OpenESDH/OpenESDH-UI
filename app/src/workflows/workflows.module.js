
    angular
        .module('openeApp.workflows', [ 'ngMaterial' ])
        .config(config);
    
    function config($provide, startCaseWorkflowServiceProvider){
        
        $provide.decorator('mtWizardDirective', function($delegate, $controller){
            var directive = $delegate[0];

            directive.$$isolateBindings.onCancel = {
                    attrName: 'onCancel',
                    mode: '&',
                    optional: 'true'
            };
            
            //Customizing mt-wizard template here since there is no other way
            directive.template = function (scope, element, attributes) {
                var template =
                    '<div layout="column" class="md-whiteframe-z1" layout-padding>' +
                    ' <div layout="row"  layout-sm="column" layout-align="space-between start" layout-margin>' +
                    '  <div><h3>{{curentStepTitle}}</h3></div>' +
                    ' </div>' +
                    '<md-divider ></md-divider>' +
                    ' <div layout="row"  class="wizard-container" ng-transclude ></div>' +
                    ' <div layout="row" layout-align="end center" >' +
                    '  <md-button class="md-primary" aria-label="cancel" ng-click="onCancel()" ng-show="selectedIndex == 0 ">{{"COMMON.CANCEL" | translate}}</md-button>' +
                    '  <md-button class="md-primary" aria-label="previous" ng-click="previous()" ng-show="selectedIndex > 0 ">{{"COMMON.BACK" | translate}}</md-button>' +
                    '  <md-button class="md-primary" aria-label="next" ng-click="next()"  ng-show="selectedIndex < steps.length -1">{{"COMMON.NEXT" | translate}}</md-button>' +
                    '  <md-button class="md-primary" aria-label="finish" ng-click="onFinish()"  ng-show="selectedIndex == steps.length -1">{{"COMMON.DONE" | translate}}</md-button>' +
                    ' </div>' +
                    '</div>';
                  return template;

                };
                
            return $delegate;
        });
        
        startCaseWorkflowServiceProvider.wfDialogConfig({
            workflowName: 'activiti$activitiAdhoc',
            controller: 'StartSingleRecipientWorkflowController',
            controllerAs: 'dlg',
            templateUrl: 'app/src/workflows/view/startSingleRecipientWorkflow.html' 
        }).wfDialogConfig({
            workflowName: 'activiti$activitiParallelGroupReview',
            controller: 'StartParallelGroupReviewWorkflowController',
            controllerAs: 'dlg',
            templateUrl: 'app/src/workflows/view/startParallelGroupReviewWorkflow.html'
        }).wfDialogConfig({
            workflowName: 'activiti$activitiParallelReview',
            controller: 'StartParallelReviewWorkflowController',
            controllerAs: 'dlg',
            templateUrl: 'app/src/workflows/view/startParallelReviewWorkflow.html'            
        }).wfDialogConfig({
            workflowName: 'activiti$activitiReview',
            controller: 'StartSingleRecipientWorkflowController',
            controllerAs: 'dlg',
            templateUrl: 'app/src/workflows/view/startSingleRecipientWorkflow.html'
        }).wfDialogConfig({
             workflowName: 'activiti$activitiReviewPooled',
             controller: 'StartPooledReviewWorkflowController',
             controllerAs: 'dlg',
             templateUrl: 'app/src/workflows/view/startParallelGroupReviewWorkflow.html'
        });
        
    }