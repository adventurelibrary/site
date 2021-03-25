"use strict";
exports.__esModule = true;
exports.filenameToTitle = exports.filenameGuessType = exports.commaAndJoin = exports.arrayToKeyBool = exports.keyBoolToArray = exports.sleep = void 0;
var asset_consts_1 = require("~/lib/assets/asset-consts");
var sleep = function (ms) {
    if (ms === void 0) { ms = 500; }
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
exports.sleep = sleep;
function keyBoolToArray(checked) {
    if (!checked) {
        return [];
    }
    var vals = [];
    Object.keys(checked).forEach(function (key) {
        if (checked[key]) {
            vals.push(key);
        }
    });
    return vals;
}
exports.keyBoolToArray = keyBoolToArray;
// For checklist
function arrayToKeyBool(keys) {
    if (!keys) {
        return {};
    }
    var vals = {};
    keys.forEach(function (key) {
        vals[key] = true;
    });
    return vals;
}
exports.arrayToKeyBool = arrayToKeyBool;
// ["blue", "red", "green"] => blue, red, and green
function commaAndJoin(pieces) {
    if (pieces.length <= 2) {
        return pieces.join(' and ');
    }
    var last = pieces.pop();
    return pieces.join(', ') + ', and ' + last;
}
exports.commaAndJoin = commaAndJoin;
function titleCase(str) {
    return str.toUpperCase().substr(0, 1) + str.toLowerCase().substr(1);
}
function isKebabOrTitleCase(str) {
    return str.indexOf(' ') == -1
        && str.toLowerCase() != str
        && str.toUpperCase() != str
        && str.indexOf('-') == -1
        && str.indexOf('_') == -1;
}
function filenameGuessType(filename) {
    var lower = filename.toLowerCase();
    for (var i = 0; i < asset_consts_1.ASSET_CATEGORIES.length; i++) {
        var at = asset_consts_1.ASSET_CATEGORIES[i];
        if (lower.indexOf(at.key) >= 0) {
            return at.key;
        }
    }
    return 'map';
}
exports.filenameGuessType = filenameGuessType;
function filenameToTitle(filename) {
    var parts = filename.split('.');
    parts.pop(); // Remove file extension
    var words = [];
    var basename = parts.join('.');
    if (isKebabOrTitleCase(basename)) {
        words = basename.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');
    }
    else {
        var title_1 = parts.join('_'); // Rejoin in case they had multiple .'s in the filename
        words = title_1.split(/[-_]/);
    }
    var smallwords = ['of', 'the', 'in', 'a'];
    var title = words.map(function (word, idx) {
        if (idx == 0) {
            return titleCase(word);
        }
        if (smallwords.indexOf(word) >= 0) {
            return word.toLowerCase();
        }
        return titleCase(word);
    }).join(' ');
    return title;
}
exports.filenameToTitle = filenameToTitle;
