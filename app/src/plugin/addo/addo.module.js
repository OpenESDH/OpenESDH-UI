angular
        .module('openeApp.addo', [ 'pascalprecht.translate'])
        .config(config);

function config(caseDocumentsSendItemsServiceProvider) {
    caseDocumentsSendItemsServiceProvider.addMenuItem('ADDO.DOCUMENT.SEND_FOR_SIGNING', 'sendToAddoService');
}