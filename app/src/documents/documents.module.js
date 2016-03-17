angular
        .module('openeApp.documents', ['ngMaterial', 'pascalprecht.translate'])
        .config(config);

function config(caseDocumentActionsServiceProvider, dashboardServiceProvider, caseDocumentEditActionsServiceProvider) {
    //documents list
    caseDocumentActionsServiceProvider.addMenuItem('DOCUMENT.EMAIL_DOCUMENTS', 'emailDocumentsService');
    //document edit
    caseDocumentEditActionsServiceProvider
            .addItem('DOCUMENT.EDIT_DOCUMENT_SHAREPOINT', 'description', 'caseDocumentEditInSharePointService', isVisible, isDisabled);

    //dashboard
    dashboardServiceProvider.addDashlet({
        templateUrl: 'app/src/documents/view/myDocumentsDashlet.html',
        position: 'left',
        order: 2
    });

    dashboardServiceProvider.addExtUserDashlet({
        templateUrl: 'app/src/documents/view/myDocumentsDashlet.html',
        position: 'left',
        order: 2
    });
}

function isVisible(doc) {
    return doc && doc.canEditOnlineDocument;
}

function isDisabled(doc){
    return doc === undefined || doc.isLocked || doc.editLockState.isLocked;
}
