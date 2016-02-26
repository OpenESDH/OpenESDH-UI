    angular
        .module('openeApp.documents', ['ngMaterial', 'pascalprecht.translate'])
        .config(config);

    function config(caseDocumentActionsServiceProvider, dashboardServiceProvider) {
        caseDocumentActionsServiceProvider.addMenuItem('DOCUMENT.EMAIL_DOCUMENTS', 'emailDocumentsService');
        dashboardServiceProvider.addDashlet({
            templateUrl: 'app/src/documents/view/myDocumentsDashlet.html',
            position: 'left',
            order: 2
        });
    }
