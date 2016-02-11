angular
        .module('openeApp.documents', ['ngMaterial', 'pascalprecht.translate'])
        .config(config);

function config(caseDocumentActionsServiceProvider) {
    caseDocumentActionsServiceProvider.addMenuItem('DOCUMENT.EMAIL_DOCUMENTS', 'emailDocumentsService');
}
