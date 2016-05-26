angular
        .module('openeApp.documents', ['ngMaterial', 'pascalprecht.translate'])
        .config(config);

function config(caseDocumentActionsServiceProvider, sendDocumentsActionsServiceProvider, dashboardServiceProvider, documentEditActionsServiceProvider,
        documentAttachmentEditActionsServiceProvider) {
    //documents list
    caseDocumentActionsServiceProvider.addAction('/app/src/documents/view/createFolderAction.html', -1);
    caseDocumentActionsServiceProvider.addAction('/app/src/documents/view/uploadDocumentAction.html', 1);
    caseDocumentActionsServiceProvider.addAction('/app/src/documents/view/sendDocumentsAction.html', 2);
    
    sendDocumentsActionsServiceProvider.addMenuItem('DOCUMENT.EMAIL_DOCUMENTS', 'emailDocumentsService');
    //document edit
    documentEditActionsServiceProvider
            .addItem('DOCUMENT.EDIT_DOCUMENT_SHAREPOINT', 'description', 'documentEditInSharePointService', isVisible_doc, isDisabled_doc);
    //attachment edit
    documentAttachmentEditActionsServiceProvider
            .addItem('DOCUMENT.EDIT_DOCUMENT_SHAREPOINT', 'description', 'documentAttachmentEditInSharePointService', isVisible_EditOnlineAttachment, isDisabled_EditOnlineAttachment);

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

function isVisible_doc(doc) {
    return doc && doc.canEditOnlineDocument;
}

function isDisabled_doc(doc) {
    return doc === undefined || doc.isLocked || doc.editLockState.isLocked;
}

function isVisible_EditOnlineAttachment(attachment, documentEditable) {
    return true;
}

function isDisabled_EditOnlineAttachment(attachment, documentEditable) {
    return attachment === undefined || attachment.locked || !documentEditable || !attachment.canBeEditedOnline;
}