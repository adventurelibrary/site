"use strict";
exports.__esModule = true;
exports.stringToFilterType = exports.tagToFilter = exports.assetTypeToFilter = void 0;
var FilterTypeMap = {
    'tag': 'tag',
    'creator': 'creator',
    'price': 'price',
    'type': 'type'
};
function assetTypeToFilter(type) {
    return {
        type: 'type',
        label: type.plural,
        value: type.key
    };
}
exports.assetTypeToFilter = assetTypeToFilter;
function tagToFilter(tag) {
    return {
        type: 'tag',
        label: tag.label,
        value: tag.key
    };
}
exports.tagToFilter = tagToFilter;
function stringToFilterType(str) {
    if (FilterTypeMap.hasOwnProperty(str)) {
        return FilterTypeMap[str];
    }
    return null;
}
exports.stringToFilterType = stringToFilterType;
