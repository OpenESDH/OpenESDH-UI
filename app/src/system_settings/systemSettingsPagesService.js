angular
        .module('openeApp.systemsettings')
        .provider('systemSettingsPagesService', SystemSettingsPagesServiceProvider);

function SystemSettingsPagesServiceProvider() {
    var pages = [];
    var modulesPages = [];
    this.addPage = addPage;
    this.addModulePage = addModulePage;
    this.$get = SystemSettingsPagesService;

    /**
     * @param labelKey - key for translation
     * @param sref - of page
     * @param icon - material icon name; default: 'content_copy'
     * @returns {SystemSettingsPagesServiceProvider}
     */
    function addPage(labelKey, sref, icon) {
        pages.push({
            labelKey: labelKey,
            sref: sref,
            icon: icon || 'content_copy'
        });
        return this;
    }
    
    function addModulePage(labelKey, sref, icon) {
        modulesPages.push({
            labelKey: labelKey,
            sref: sref,
            icon: icon || 'content_copy'
        });
        return this;
    }

    function SystemSettingsPagesService() {
        var service = {
            getPages: getPages,
            getModulesPages: getModulesPages
        };
        return service;

        function getPages() {
            return pages;
        }
        
        function getModulesPages(){
            return modulesPages;
        }
    }
}