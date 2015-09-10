(function(){
    'use strict';

    angular
        .module('openeApp.office')
        .controller('OfficeController', OfficeController);

    var email;

    OfficeController.$inject = ['$window', 'officeService', 'caseService', 'sessionService'];

    function OfficeController($window, officeService, caseService, sessionService) {
        var vm = this;

        vm.email = email;
//        vm.from = email.From;
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
                var metadata = {
                    caseId: vm.caseId,
                    documentName: vm.subject,
                    nodeRef: response.nodeRef,
                    ticket: sessionService.getUserData().ticket
                };
                $window.external.SaveAsOpenEsdh(JSON.stringify(metadata), JSON.stringify(vm.attachments.filter(function(attachment) {
                    return attachment.selected;
                })));
            });
        }

        function cancel() {
            $window.external.CancelOpenEsdh();
        }
    }

    // This function is called from the Office Add-In
    window.loadEmail = function(payload) {
        email = JSON.parse(payload);
    }
})();