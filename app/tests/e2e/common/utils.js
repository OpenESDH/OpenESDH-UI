/**
 * Usage: Generate random string.
 * characterLength :  Length of string.
 * Returns : Random string.
 *
 * credit: http://qainsight.blogspot.dk/2014/04/get-random-string-email-string-and.html
 */
module.exports.generateRandomAlphabetString = function (characterLength) {
    var randomText = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < characterLength; i++)
        randomText += possible.charAt(Math.floor(Math.random() * possible.length));
    return randomText;
};

module.exports.generateRandomAlphaNumericString = function (characterLength) {
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

/**
 * Usage: Generate random number.
 * characterLength :  Length of number.
 * Returns : Random number.
 */
module.exports.getRandomNumber = function (numberLength) {
    var randomNumber = "";
    var possible = "0123456789";
    for (var i = 0; i < numberLength; i++)
        randomNumber += possible.charAt(Math.floor(Math.random() * possible.length));
    return randomNumber;
};