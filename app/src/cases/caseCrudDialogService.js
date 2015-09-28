(function () {
    'use strict';

    angular
        .module('openeApp.cases')
        .factory('caseCrudDialogService', caseCrudDialogService);

    caseCrudDialogService.$inject = ['$http', '$mdDialog', '$location', 'caseService'];

    function caseCrudDialogService($http, $mdDialog, $location, caseService) {
        return {
            createCase: createCase,
            editCase: editCase
        };
        
        function createCase(caseType) {
            //TODO: In the future, we'll need the ability to create other types of cases

            $mdDialog.show({
                controller: CaseDialogController,
                controllerAs: 'vm',
                templateUrl: 'app/src/cases/view/caseCrudDialog.html',
                parent: angular.element(document.body),
                targetEvent: null,
                clickOutsideToClose: true,
                focusOnOpen: false,
                locals: {
                    caseObj: {
                        startDate: new Date(),
                        journalKey: [],
                        journalFacet: []
                    }
                }
            }).then(function(c){
                var caseData = angular.copy(c);
                prepareCaseData(caseData);
                // When submitting, do something with the case data
                caseService.createCase(caseData).then(function (caseId) {
                    $location.path("/cases/case/" + caseId);
                    // When the form is submitted, show a notification:
                    notificationUtilsService.notify('Case ' + caseData.title + ' created');
                }, function (response) {
                    notificationUtilsService.alert('Error creating case: ' + response.data.message);
                });
            });
        }
        
        function editCase(caseObj){
            return $mdDialog.show({
                controller: CaseDialogController,
                controllerAs: 'vm',
                templateUrl: 'app/src/cases/view/caseCrudDialog.html',
                parent: angular.element(document.body),
                targetEvent: null,
                clickOutsideToClose: true,
                focusOnOpen: false,
                locals: {
                    caseObj: caseObj
                }
            }).then(function(caseObj) {
                    prepareCaseData(caseObj);
                    return caseService.updateCase(caseObj).then(function(result){
                        return result;
                    });
            }, 
            function() {
                console.log('You cancelled the dialog.');
            });
        }
        
        function prepareCaseData(caseData){
            if (caseData.journalKey.length > 0) {
                caseData.journalKey = caseData.journalKey[0].nodeRef;
            } else {
                delete caseData.journalKey;
            }
            
            if (caseData.journalFacet.length > 0) {
                caseData.journalFacet = caseData.journalFacet[0].nodeRef;
            } else {
                delete caseData.journalFacet;
            }
        }
        
        CaseDialogController.$inject = ['$scope', '$mdDialog', '$animate', 'notificationUtilsService'];
        function CaseDialogController($scope, $mdDialog, $animate, notificationUtilsService, caseObj) {
            var vm = this;
            
            // Data from the case creation form
            $scope.case = caseObj;
            $scope.editCase = (caseObj.nodeRef && caseObj.nodeRef.length > 0);
            
            vm.cancel = cancel;
            vm.update = update;

            // Cancel or submit form in dialog
            function cancel(form) {
                $mdDialog.cancel();
            }
            
            function update(c) {
                $mdDialog.hide(c);
            }
        }
    }
})();