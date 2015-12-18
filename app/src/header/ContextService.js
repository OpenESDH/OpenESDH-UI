angular
    .module('openeApp.search')
    .constant('CONTEXTS', {
        'cases': {
            name: 'CASE.CASES',
            id: 'cases'
        },
        'documents': {
            name: 'DOCUMENT.DOCUMENTS',
            id: 'documents'
        },
        'templates': {
            name: 'DOCUMENT.TEMPLATE.LABELS.TEMPLATES',
            id: 'templates'
        }
    })
    .factory('ContextService', ContextService);

function ContextService(CONTEXTS) {
    var service = {};
    var _activeContext;

    service.getContext = function () {
        return _activeContext;
    };

    service.setContext = function (context) {
        _activeContext = CONTEXTS[context];
        return true;
    };

    service.clearContext = function () {
        _activeContext = null;
        return true;
    };

    return service;

}