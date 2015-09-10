(function(){
    'use strict';

    angular
        .module('openeApp.office')
        .controller('OfficeController', OfficeController);

    var email;

    OfficeController.$inject = ['$window', 'officeService', 'caseService', '$q'];

    function OfficeController($window, officeService, caseService, $q) {
        var vm = this;
        vm.email = email;
        vm.from = email.From.EMail;
        vm.subject = email.Subject;
        vm.caseId;
        vm.attachments = email.Attachments;
        
        vm.save = save;
        vm.cancel = cancel;

        function save() {
            officeService.saveEmail({
                caseId: vm.caseId,
                name: vm.subject,
                email: vm.email
            }).then(function(response) {
                alert(JSON.stringify(response));
                var metadata = {
                    caseId: vm.caseId,
                    documentName: vm.subject,
                    nodeRef: response.nodeRef
                };
                $window.external.SaveAsOpenEsdh(JSON.stringify(metadata), JSON.stringify(vm.attachments.filter(function(attachment) {
                    return attachment.selected;
                })));
            });
        }

        function cancel() {
            $window.external.CancelOpenEsdh();
        }
        
        
        /*
         * Autocomplete input
         */
        
        vm.querySearch = querySearch;
        function querySearch (query) {
          var allTheCases =  [
            { title: 'Case 1', id: '2342' },
            { title: 'Case 2', id: '52' },
            { title: 'Case 3', id: '74' },
            { title: 'Case 4', id: '97663' },
            { title: 'Case 5', id: '35751' }
          ];
          return allTheCases;
        }
        
    }

    // This function is called from the Office Add-In
    window.loadEmail = function(payload) {
        email = JSON.parse(payload);
    }
})();