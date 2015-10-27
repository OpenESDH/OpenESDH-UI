/**
 * Usage: Generate random string.
 * characterLength :  Length of string.
 * Returns : Random string.
 *
 * credit: http://qainsight.blogspot.dk/2014/04/get-random-string-email-string-and.html
 */
module.exports.generateRandomString = function (characterLength) {
    var randomText = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < characterLength; i++)
        randomText += possible.charAt(Math.floor(Math.random() * possible.length));
    return randomText;
};

/**
 * Usage: Return Random Email Id.
 */
module.exports.getRandomEmail = function () {
    var strValues = "abcdefghijk123456789";
    var strEmail = "";
    for (var i = 0; i < 7; i++) {
        strEmail = strEmail + strValues.charAt(Math.round(strValues.length * Math.random()));
    }
    return strEmail + "@magenta.dk";
};
