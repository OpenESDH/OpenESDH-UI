angular.module('openeApp.contacts', ['ngMaterial'])
        .config(config);

function config(modulesMenuServiceProvider, $stateProvider, USER_ROLES) {
    modulesMenuServiceProvider.addItem({
        templateUrl: 'app/src/contacts/view/menuItem.html',
        order: 2
    });

    $stateProvider.state('administration.organizations', {
        url: '/organizations',
        data: {
            authorizedRoles: [USER_ROLES.admin],
            searchContext: 'CONTACT_ORGANISATIONS',
            selectedTab: 2
        },
        views: {
            'organizations': {
                templateUrl: 'app/src/contacts/view/organizations.html',
                controller: 'OrganizationController',
                controllerAs: 'vm'
            }
        }
    }).state('administration.organization', {
        url: '/organization/:storeProtocol/:storeIdentifier/:uuid',
        data: {
            authorizedRoles: [USER_ROLES.admin],
            selectedTab: 2
        },
        views: {
            'organizations': {
                templateUrl: 'app/src/contacts/view/organization.html',
                controller: 'OrganizationController',
                controllerAs: 'ovm'
            }
        }
    }).state('administration.contacts', {
        url: '/contacts',
        data: {
            authorizedRoles: [USER_ROLES.admin],
            searchContext: 'CONTACT_USERS',
            selectedTab: 3
        },
        views: {
            'contacts': {
                templateUrl: 'app/src/contacts/view/persons.html',
                controller: 'PersonsController',
                controllerAs: 'vm'
            }
        }
    }).state('contacts', {
        parent: 'site',
        url: '/contacts',
        data: {
            authorizedRoles: [USER_ROLES.user],
            selectedTab: 0
        },
        views: {
            'content@': {
                templateUrl: 'app/src/contacts/view/contacts.html',
                controller: 'ContactsController',
                controllerAs: 'vm'
            }
        }
    }).state('contacts.persons', {
        url: '/persons',
        data: {
            authorizedRoles: [USER_ROLES.user],
            selectedTab: 0,
            hideHeader: true
        },
        views: {
            'persons': {
                templateUrl: 'app/src/contacts/view/persons.html',
                controller: 'PersonsController',
                controllerAs: 'vm'
            }
        }
    }).state('contacts.organizations', {
        url: '/organizations',
        data: {
            authorizedRoles: [USER_ROLES.user],
            selectedTab: 1,
            hideHeader: true
        },
        views: {
            'organizations': {
                templateUrl: 'app/src/contacts/view/organizations.html',
                controller: 'OrganizationController',
                controllerAs: 'vm'
            }
        }
    }).state('contacts.organization', {
        url: '/organization/:storeProtocol/:storeIdentifier/:uuid',
        views: {
            'organizations': {
                templateUrl: 'app/src/contacts/view/organization.html',
                controller: 'OrganizationController',
                controllerAs: 'ovm'
            }
        },
        data: {
            authorizedRoles: [USER_ROLES.user],
            selectedTab: 1
        }
    });
}