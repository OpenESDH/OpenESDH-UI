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

