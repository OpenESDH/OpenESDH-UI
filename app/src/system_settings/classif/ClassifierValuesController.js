    angular
        .module('openeApp.systemsettings')
        .controller('ClassifierValuesController', ClassifierValuesController);

    function ClassifierValuesController($mdDialog, $translate, PATTERNS, availableLanguages, classifierValuesService, classifType) {
        var vm = this;
        vm.classifierValues = [];
        vm.loadList = loadList;
        vm.showEdit = showEdit;
        vm.doDelete = doDelete;
        vm.showDialog = showDialog;
        vm.deleteConfirmMessage = '';
        vm.dialogFormUrl = 'app/src/system_settings/classif/view/classifValueCrudDialog.html';
        vm.dialogControllerAs = 'dlg';
        vm.dialogTitleMessageKey = '';
        vm.classifType = classifType;

        function loadList() {
            var vm = this;
            classifierValuesService.getClassifierValues(vm.classifType).then(function(data) {
                vm.classifierValues = data;
                return data;
            });
        }

        function doDelete(ev, classifierValue) {
            var vm = this;
            var confirm = $mdDialog.confirm()
                    .title($translate.instant('COMMON.CONFIRM'))
                    .textContent($translate.instant(vm.deleteConfirmMessage, {title: classifierValue.displayName}))
                    .targetEvent(ev)
                    .ok($translate.instant('COMMON.YES'))
                    .cancel($translate.instant('COMMON.CANCEL'));
            $mdDialog.show(confirm).then(function() {
                classifierValuesService.deleteClassifierValue(vm.classifType, classifierValue.nodeRef).then(function() {
                    var currentCategory = vm.classifierValues.indexOf(classifierValue);
                    vm.classifierValues.splice(currentCategory, 1);

                });
            });
            ev.stopPropagation();
        }

        function showEdit(ev, classifierValue) {
            var vm = this;
            if(!classifierValue) return vm.showDialog(ev, null);
            return vm.showDialog(ev, angular.copy(classifierValue));
        }

        function showDialog (ev, classifierValue) {
            var vm = this;
            var val = classifierValue ? classifierValue : null;
            $mdDialog.show({
                controller: ClassifierValueDialogController,
                controllerAs: vm.dialogControllerAs,
                templateUrl: vm.dialogFormUrl,
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    classifierValue: val,
                    dialogTitleMessageKey: vm.dialogTitleMessageKey
                }
            }).then(function(){
               vm.loadList(); 
            });
        }

        function ClassifierValueDialogController($scope, $mdDialog, classifierValue, dialogTitleMessageKey) {
            var dc = this;
            dc.classifierValue = classifierValue;
            dc.cancel = cancel;
            dc.save = save;
            dc.PATTERNS = PATTERNS;
            dc.availableLanguages = availableLanguages.keys;
            dc.dialogTitleMessageKey = dialogTitleMessageKey;

            function cancel() {
                $mdDialog.cancel();
            }

            function save(form) {
                if (!form.$valid) {
                    return;
                }
                classifierValuesService
                    .saveClassifierValue(classifType, dc.classifierValue)
                    .then(refreshInfoAfterSuccess);
            }

            function refreshInfoAfterSuccess(savedClassifierValue) {
                $mdDialog.hide();
            }
        }
        
    }