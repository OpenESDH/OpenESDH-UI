    angular
        .module('openeApp.caseTemplates')
        .controller('CaseTemplatesController', CaseTemplatesController);
    
    function CaseTemplatesController($mdDialog, $translate, caseTemplateDialogService, caseTemplatesService, startCaseWorkflowService, alfrescoNodeUtils){
        var vm = this;
        vm.init = init;
        vm.loadTemplates = loadTemplates;
        vm.createTemplate = createTemplate;
        vm.getWorkflowDisplayName = getWorkflowDisplayName;
        vm.getPrefilledPropName = getPrefilledPropName;
        vm.getPrefilledProps = getPrefilledProps;
        vm.tplNodeRefObj = tplNodeRefObj;
        vm.isPropSet = isPropSet;
        vm.workflowDefs = [];
        
        vm.availableProps = ["cm:title",
                             "oe:owners",
                             "cm:description",
                             "base:endDate",
                             "base:startDate",
                             "oe:journalFacet",
                             "oe:journalKey"];
        
        vm.propNameKeyPrefixes = ["CASE_TEMPLATES.PREFILLED."];
        
        function init(){
            var vm = this;
            vm.loadTemplates();
            startCaseWorkflowService.getWorkflowDefinitions().then(function(result){
                vm.workflowDefs = result;
            });
        }
        
        function loadTemplates(){
            var vm = this;
            caseTemplatesService.getTemplates(vm.caseType).then(function(templates){
                vm.templates = templates.map(function(template){
                    template.prefilledProps = vm.getPrefilledProps(template);
                    return template;
                });
            });
        }
        
        function getPrefilledPropName(prop){
            var vm = this;
            for(var i=0; i<vm.propNameKeyPrefixes.length; i++){
                var prefix = vm.propNameKeyPrefixes[i];
                var propName = $translate.instant(prefix + prop);
                if(propName.indexOf(prefix) == -1){
                    return propName;
                }
            }
            return prop;
        }
        
        function getWorkflowDisplayName(workflowDefId){
            var vm = this;
            for(var i = 0; i < vm.workflowDefs.length; i++){
                if(workflowDefId == vm.workflowDefs[i].id){
                    return vm.workflowDefs[i].title;
                }
            }
            return workflowDefId;
        }
        
        function getPrefilledProps(template){
            var vm = this;
            var props = [];
            for(var i=0; i<vm.availableProps.length; i++){
                var prop = vm.availableProps[i];
                var value = template.properties[prop];
                if(vm.isPropSet(prop, value)){
                    props.push(prop);
                }
            }
            return props;
        }
        
        function isPropSet(prop, value){
            if(value === "" || value.value === undefined || value.value === ""){
                return false;
            }
            if(prop == "oe:owners" && value.value[0] == "admin"){
                return false;
            }
            return true;
        }
        
        function createTemplate(){
            var vm = this;
            caseTemplateDialogService.createTemplate(vm.caseType).then(function(){
                vm.loadTemplates();
            });
        }
        
        function tplNodeRefObj(template){
            return alfrescoNodeUtils.processNodeRef(template.properties.nodeRef);
        }
        
    }