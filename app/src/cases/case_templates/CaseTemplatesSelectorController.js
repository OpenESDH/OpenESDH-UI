    angular
        .module('openeApp.caseTemplates')
        .controller('CaseTemplatesSelectorController', CaseTemplatesSelectorController);
    
    function CaseTemplatesSelectorController(caseTemplatesService, caseInfo){
        var vm = this;
        vm.caseTemplateSelected = caseTemplateSelected;
        vm.clearCaseTemplate = clearCaseTemplate;
        vm.getSelectedTemplate = getSelectedTemplate;
        vm.getTemplateProps = getTemplateProps;
        vm.initExtra = initExtra;

        function initExtra(){
            if(caseInfo.newCase !== true){
                return;
            }
            var vm = this;
            vm.extrasUI.push({
                formUrl: 'app/src/cases/case_templates/view/caseTemplatesSelector.html'
            });
            caseTemplatesService.getTemplates(caseInfo.type).then(function(templates){
                vm.caseTemplates = templates;
            });
        }
        
        function caseTemplateSelected(){
            var vm = this;
            var template = vm.getSelectedTemplate();
            var props = vm.getTemplateProps(template);
            angular.extend(vm.case, props);
        }
        
        function getTemplateProps(template){
            var vm = this;
            var props = vm.getCasePropsForEdit(template);
            var owner = template.properties.owners[0];
            if(owner.name == "admin"){
                delete props.assoc_base_owners_added;
            }else{
                props.owner = owner.displayName;    
            }
            return props;
        }
        
        function getSelectedTemplate(){
            var vm = this;
            var selected = vm.caseTemplates.filter(function(item){
                return item.properties.nodeRef == vm.case.prop_cm_template;
            });
            return selected[0];
        }
        
        function clearCaseTemplate(){
            var vm = this;
            vm.case.prop_cm_template = undefined;
        }
    }