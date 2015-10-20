
angular
        .module('openeApp.office')
        .controller('OfficeController', OfficeController);

var document;

function OfficeController($stateParams, $window, $controller, $translate, officeService, caseService, sessionService, caseDocumentsService, notificationUtilsService) {
    var vm = this;

    if (typeof $window.external.getParameter1 !== 'undefined') {
        vm.document = JSON.parse($window.external.getParameter1());
    } else {
        vm.document = {};
        vm.document.Attachments = [];
    }

    vm.newCase = false;
    vm.selectedCase;
    vm.subject = vm.document.Subject;
    vm.title = vm.document.Title;
    vm.attachments = vm.document.Attachments;

    vm.saveEmailWithCase = saveEmailWithCase;
    vm.saveEmail = saveEmail;
    vm.cancel = cancel;
    vm.saveOfficeDocument = saveOfficeDocument;
    vm.setPartial = setPartial;

    loadDocumentConstraints();

    if ($stateParams.alf_ticket) {
        sessionService.setUserInfo({ticket: $stateParams.alf_ticket});
    }

    function setPartial(caseType){
        vm.formTemplateUrl = '';
        var type = caseType?caseType.split(':')[0]:'';

        var caseInfo = {
            newCase: true,
            type: caseType
        };

        vm.newCase = true;

        switch(type){
            case 'simple':
                angular.extend(this, $controller('CaseCommonDialogController', {caseInfo: caseInfo}));
                vm.init();
                break;
            case 'staff':
                angular.extend(this, $controller('StaffCaseDialogController', {caseInfo: caseInfo}));
                vm.init();
                break;
            case '':
                vm.newCase = false;
                break;
        }

    }

    function saveEmailWithCase() {
        if (vm.newCase) {
            var props = vm.getPropsToSave();
            // When submitting, do something with the case data
            caseService.createCase(vm.caseInfo.type, props).then(function (caseId) {
                notificationUtilsService.notify('Case creates: ' + caseId);
                saveEmail(caseId);
            }, function (response) {
                notificationUtilsService.alert($translate.instant("CASE.ERROR_CREATING_CASE", {case_title: props.prop_cm_title}) + response.data.message);
            });
        } else {
            saveEmail(vm.selectedCase['oe:id']);
        }
    }

    function saveEmail(caseId){
        notificationUtilsService.notify('Saving email for... ' + caseId);
        officeService.saveEmail({
            caseId: caseId,
            name: vm.subject,
            email: vm.document
        }).then(function(response) {
            notificationUtilsService.notify('Email saved');
            var metadata = {
                caseId: caseId,
                documentName: vm.subject,
                nodeRef: response.nodeRef
            };
            var atms = vm.attachments.filter(function(attachment) {
                return attachment.selected;
            });
            $window.external.SaveAsOpenEsdh(JSON.stringify(metadata), JSON.stringify(atms));
        }, function(response) {
            notificationUtilsService.alert(response.data.message);
        });
    }

    function cancel() {
        $window.external.CancelOpenEsdh();
    }

    function saveOfficeDocument(form) {
        caseService.getCaseDocumentsFolderNodeRef(vm.selectedCase['oe:id']).then(function(response) {
            var metadata = {
                caseId: vm.selectedCase['oe:id'],
                documentName: vm.title,
                nodeRef: response.caseDocsFolderNodeRef,
                docType: vm.documentProperties.doc_type,
                docCategory: vm.documentProperties.doc_category
            };
            $window.external.SaveAsOpenEsdh(JSON.stringify(metadata), null);
        }, function(error) {
            $window.alert(JSON.stringify(error));
        });
    }

    /*
     * Autocomplete input
     */

    vm.querySearch = querySearch;
    function querySearch(query) {
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

    function loadDocumentConstraints() {
        caseDocumentsService.getCaseDocumentConstraints().then(function(documentConstraints) {
            vm.documentConstraints = documentConstraints;
        });
    }

}

// This function is called from the Office Add-In
window.loadDocument = function(payload) {
//        window.alert(payload);
//        document = JSON.parse(payload);
};
