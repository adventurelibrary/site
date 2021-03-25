"use strict";
exports.__esModule = true;
exports.ACCEPTED_IMAGE_TYPES = exports.AssetTagOptions = exports.AssetTypeOptionsSingular = exports.AssetTypeOptions = exports.AssetSearchActions = exports.ASSET_TAGS = exports.ASSET_CATEGORIES = void 0;
exports.ASSET_CATEGORIES = [{
        id: btoa('map'),
        singular: 'Map',
        plural: 'Maps'
    }, {
        id: btoa('token'),
        singular: 'Token',
        plural: 'Tokens'
    }, {
        id: btoa('portrait'),
        singular: 'Portrait',
        plural: 'Portraits'
    }];
exports.ASSET_TAGS = "Winter,Summer,Fall,Spring,Fantasy,Orc,Archer,Priest,Barbarian,Town,Village,Castle"
    .split(',')
    .sort()
    .map(function (label) {
    return {
        label: label,
        id: btoa(label.toLocaleLowerCase())
    };
});
exports.AssetSearchActions = [{
        key: 'type',
        prefix: 'type',
        description: 'filter by map, token, character'
    }, {
        key: 'tag',
        prefix: 'tag',
        description: 'find assets with specific tags'
    }];
exports.AssetTypeOptions = exports.ASSET_CATEGORIES.map(function (type) {
    return {
        value: type.id,
        label: type.plural
    };
});
exports.AssetTypeOptionsSingular = exports.ASSET_CATEGORIES.map(function (type) {
    return {
        value: type.id,
        label: type.singular
    };
});
exports.AssetTagOptions = exports.ASSET_TAGS.map(function (type) {
    return {
        value: type.id,
        label: type.label
    };
});
exports.ACCEPTED_IMAGE_TYPES = 'image/png, image/jpg, image/jpeg';
