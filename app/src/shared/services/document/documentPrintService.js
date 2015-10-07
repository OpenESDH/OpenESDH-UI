(function() {
    'use strict';

    angular
        .module('openeApp')
        .factory('documentPrintService', documentPrintService);

    function documentPrintService() {
        
        var service = {
            printPdfFromArray: printPdfFromArray
        };
        return service;
        
        function printPdfFromArray(fileBytes, fileName){
            var blob = new Blob([fileBytes], {type: 'application/pdf;filename=' + fileName});
            if(window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, fileName);
            }else{
                var url = window.URL.createObjectURL(blob);
                window.open(url);
                window.URL.revokeObjectURL(url);
            }
        }
        
    }
})();
