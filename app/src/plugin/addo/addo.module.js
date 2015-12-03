angular
        .module('openeApp.addo', ['pascalprecht.translate'])
        .config(config);

function config(caseDocumentsSendItemsServiceProvider, languageFilesProvider) {
    //case menu item
    caseDocumentsSendItemsServiceProvider.addMenuItem('ADDO.DOCUMENT.SEND_FOR_SIGNING', 'sendToAddoService');
    //translations
    languageFilesProvider.addFile('/app/src/plugin/addo/i18n/','-addo.json');
}