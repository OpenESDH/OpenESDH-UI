var globalHeader = {
    dashboardBtn: element(by.xpath('//a[@ui-sref=\'dashboard\']')),
    casesBtn: element(by.xpath('//a[@ui-sref=\'cases\']')),
    tasksBtn: element(by.xpath('//a[@ui-sref=\'tasks\']')),
    userMenuBtn: element(by.xpath('//md-toolbar[@id=\'global-toolbar\']//md-menu//button[@id=\'admin_menu_btn\']')),
    searchBoxInput: element(by.xpath('//div[@id=\'global-search\']//input'))
};

module.exports.getHeaderMenuItem = function () {
    return globalHeader;
};