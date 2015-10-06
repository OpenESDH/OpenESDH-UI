(function () {
    'use strict';

    angular
        .module('openeApp.cases')
        .factory('casePrintDialogService', casePrintDialogService);

    casePrintDialogService.$inject = ['$mdDialog', 'caseService', 'caseDocumentsService', 'documentPrintService'];

    function casePrintDialogService($mdDialog, caseService, caseDocumentsService, documentPrintService) {
        return {
            printCase: printCase
        };
        
        function printCase(caseId){
            caseService.getCaseInfo(caseId).then(function(caseObj){
                caseDocumentsService.getCaseDocumentsWithAttachments(caseId).then(function(documents){
                    $mdDialog.show({
                        controller: CasePrintDialogController,
                        controllerAs: 'dlg',
                        templateUrl: 'app/src/cases/view/casePrintDialog.html',
                        parent: angular.element(document.body),
                        targetEvent: null,
                        clickOutsideToClose: true,
                        locals: {
                            caseObj: caseObj.properties,
                            documents: documents
                        },
                        focusOnOpen: false
                    }).then(function(printInfo){
                        caseService.printCase(caseId, printInfo).then(function(result){
                            documentPrintService.printPdfFromArray(result, caseId + ".pdf");
                        });
                    });
                });
            });
        }
        
        function CasePrintDialogController($mdDialog, caseObj, documents){
            var vm = this;
            vm.case = caseObj;
            vm.documents = documents;
            
            vm.cancel = function() {
              $mdDialog.cancel();
            };
            
            vm.print = function(){
                var printInfo = {
                    caseDetails: vm.caseDetails === true,
                    caseHistoryLog: vm.caseHistoryLog === true,
                    comments: vm.comments === true,
                    documents: _getSelectedDocuments()
                };
                $mdDialog.hide(printInfo);
            }
            
            function _getSelectedDocuments(){
                var items = [];
                for(var i in vm.documents){
                    
                    var doc = vm.documents[i];
                    if(doc.selected === true){
                        items.push(doc.mainDocNodeRef);
                    }
                    
                    for(var j in doc.attachments){
                        var attach = doc.attachments[j];
                        if(attach.selected === true){
                            items.push(attach.nodeRef);
                        }
                    }
                }
                return items;
            }
        }
    }
})();