angular
        .module('openeApp.systemsettings')
        .provider('systemSettingsPagesService', SystemSettingsPagesServiceProvider);

function SystemSettingsPagesServiceProvider() {
    var pages = [];
    this.addPage = addPage;
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

    function SystemSettingsPagesService() {
        var service = {
            getPages: getPages
        };
        return service;

        function getPages() {
            return pages;
        }
    }
}