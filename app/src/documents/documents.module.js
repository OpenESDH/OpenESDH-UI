angular
        .module('openeApp.documents', ['ngMaterial', 'pascalprecht.translate'])
        .config(config);

function config(caseDocumentsSendItemsServiceProvider) {
    caseDocumentsSendItemsServiceProvider.addMenuItem('DOCUMENT.EMAIL_DOCUMENTS', 'emailDocumentsService');
}
