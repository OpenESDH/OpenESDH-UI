
angular
        .module('openeApp.contacts')
        .factory('personDialogService', personDialogService);

function personDialogService($mdDialog, $translate, contactsService,
        countriesService, PATTERNS, notificationUtilsService) {
    var service = {
        showPersonEdit: showPersonEdit,
        showContactReadOnly: showContactReadOnly
    };
    return service;

    function showPersonEdit(ev, person, organization, fullForm) {
        var edtPerson = person
                ? angular.copy(person)
                : (organization ? {parentNodeRefId: organization.nodeRefId} : {});
        return $mdDialog.show({
            controller: DialogController,
            templateUrl: 'app/src/contacts/view/personCrudDialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
                person: edtPerson,
                readOnly: false,
                fullForm: fullForm == undefined ? (person == undefined ? false : true) : fullForm
            }
        }).then(function(response) {
            return response;
        });
    }

    function showContactReadOnly(ev, contact) {
        return $mdDialog.show({
            controller: DialogController,
            templateUrl: 'app/src/contacts/view/personCrudDialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
                person: contact,
                readOnly: true,
                fullForm: true
            }
        }).then(function(response) {
            return response;
        });
    }

    function DialogController($scope, $mdDialog, person, readOnly, fullForm) {
        $scope.person = person;
        $scope.countries = countriesService.getCountries();
        $scope.PATTERNS = PATTERNS;
        $scope.readOnly = readOnly;
        $scope.fullForm = fullForm;

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.delete = function(ev, person) {
            var confirm = $mdDialog.confirm()
                    .title($translate.instant('COMMON.CONFIRM'))
                    .textContent($translate.instant('CONTACT.ARE_YOU_SURE_YOU_WANT_TO_DELETE_PERSON_CONTACT', person))
                    .targetEvent(ev)
                    .ok($translate.instant('COMMON.YES'))
                    .cancel($translate.instant('COMMON.CANCEL'));
            $mdDialog.show(confirm).then(function() {
                contactsService.deletePerson(person).then(function() {
                    notifyAndClose($translate.instant("CONTACT.CONTACT_DELETED_SUCCESSFULLY", person));
                }, error);
            });

        };

        $scope.save = function(personForm) {
            if (!personForm.$valid) {
                notificationUtilsService.notify($translate.instant("COMMON.FILL_ALL_REQUIRED_FIELDS"));
                return;
            }
            if ($scope.person.id) {
                contactsService.updatePerson($scope.person)
                        .then(refreshNotifyAndClose, error);
            } else {
                contactsService.createPerson($scope.person)
                        .then(refreshNotifyAndClose, error);
            }
        };

        function refreshNotifyAndClose(savedPerson) {
            notificationUtilsService.notify($translate.instant("CONTACT.CONTACT_SAVED_SUCCESSFULLY", savedPerson));
            $mdDialog.hide(savedPerson);
        }

        function notifyAndClose(msg) {
            notificationUtilsService.notify(msg);
            $mdDialog.hide();
        }
    }

    function error(response) {
        notificationUtilsService.alert(response.data.message);
    }
}