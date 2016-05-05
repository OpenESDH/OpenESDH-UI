
    angular
        .module('openeApp.cases')
        .factory('casePrintDialogService', casePrintDialogService);

    function casePrintDialogService($mdDialog, caseService, caseDocumentsService, documentPrintService) {
        return {
            printCase: printCase
        };
        
        function printCase(caseId){
            caseService.getCaseInfo(caseId).then(function(caseObj){
                $mdDialog.show({
                    controller: CasePrintDialogController,
                    controllerAs: 'dlg',
                    templateUrl: 'app/src/cases/view/casePrintDialog.html',
                    parent: angular.element(document.body),
                    targetEvent: null,
                    clickOutsideToClose: true,
                    locals: {
                        caseObj: caseObj.properties,
                        caseId: caseId
                    },
                    focusOnOpen: false
                }).then(function(printInfo){
                    caseService.printCase(caseId, printInfo).then(function(result){
                        documentPrintService.printPdfFromArray(result, caseId + ".pdf");
                    });
                });
            });
        }
        
        function CasePrintDialogController($scope, $mdDialog, caseObj, caseId){
            var vm = this;
            vm.case = caseObj;
            vm.caseId = caseId;
            vm.formDisabled = true;
            vm.selectedDocuments = [];
            
            vm.cancel = function() {
              $mdDialog.cancel();
            };
            
            vm.print = function(){
                var printInfo = {
                    caseDetails: vm.caseDetails === true,
                    caseHistoryLog: vm.caseHistoryLog === true,
                    comments: vm.comments === true,
                    documents: vm.selectedDocuments
                };
                $mdDialog.hide(printInfo);
            }
            
            $scope.$watch(function(){
                return( vm.selectedDocuments);
            }, function(){
                onSelectionChanged();
            });
            
            function onSelectionChanged(){
                vm.formDisabled = !_isAnythingSelected();
            }
            
            function _isAnythingSelected(){
                return vm.caseDetails === true 
                    || vm.caseHistoryLog === true 
                    || vm.comments === true
                    || _isAnyDocumentSelected() === true;
            }
            
            function _isAnyDocumentSelected(){
                return vm.selectedDocuments.length > 0;
            }
        }
    }