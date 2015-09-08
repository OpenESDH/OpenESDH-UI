(function(){
    'use strict';

    angular
        .module('openeApp.office')
        .controller('OfficeController', OfficeController);

    var email;

    OfficeController.$inject = ['$window', 'officeService', 'caseService'];

    function OfficeController($window, officeService, caseService) {
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
                name: vm.subject,
                email: vm.email
            });
            var metadata = {
                caseId: vm.caseId,
                documentName: vm.subject
            };
            $window.external.SaveAsOpenEsdh(JSON.stringify(metadata), JSON.stringify(vm.attachments.filter(function(attachment) {
                return attachment.selected;
            })));
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