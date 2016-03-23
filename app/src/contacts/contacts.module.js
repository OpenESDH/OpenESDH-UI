angular.module('openeApp.contacts', ['ngMaterial'])
	.config(config);

	function config(dashboardServiceProvider, modulesMenuServiceProvider) {
        modulesMenuServiceProvider.addItem({
            templateUrl: 'app/src/contacts/view/menuItem.html',
            order: 2
        });
	}