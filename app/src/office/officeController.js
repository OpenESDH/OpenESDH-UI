(function(){
    'use strict';

    angular
        .module('openeApp.office')
        .controller('OfficeController', OfficeController);

    var email;

    OfficeController.$inject = ['$stateParams', '$window', 'officeService', 'caseService', 'sessionService', '$q'];

    function OfficeController($stateParams, $window, officeService, caseService, sessionService, $q) {
        var vm = this;
        vm.email = email;
//        vm.from = email.From;
        vm.subject = email.Subject;
        vm.selectedCase;
        vm.attachments = email.Attachments;
        
        vm.save = save;
        vm.cancel = cancel;

        if ($stateParams.alf_ticket) {
            sessionService.setUserInfo({ticket: $stateParams.alf_ticket});
//            $window.sessionStorage.userInfo = JSON.stringify({ticket: $stateParams.alf_ticket});
        }
        function save() {
            officeService.saveEmail({
                caseId: vm.selectedCase['oe:id'],
                name: vm.subject,
                email: vm.email
            }).then(function(response) {
                var metadata = {
                    caseId: vm.selectedCase['oe:id'],
                    documentName: vm.subject,
                    nodeRef: response.nodeRef
                };
                var atms = vm.attachments.filter(function(attachment) {
                    return attachment.selected;
                });
                $window.external.SaveAsOpenEsdh(JSON.stringify(metadata), JSON.stringify(atms));
            }, function(error) {
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
            return caseService.getCases('base:case').then(function(response) {
                return query ? response.filter(createFilterFor(query)) : [];
            });
        }
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item) {
                return (item['oe:id'].indexOf(query) != -1 || item['cm:title'].indexOf(query) != -1);
            };
        }

    }

    // This function is called from the Office Add-In
    window.loadEmail = function(payload) {
        email = JSON.parse(payload);
    }
})();