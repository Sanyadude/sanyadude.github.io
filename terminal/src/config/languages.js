export const LANGUAGES = Object.freeze([
    { name: "English", nameSelf: "English", name2: "en", name3: "eng", name3Self: "eng" },
    { name: "Ukrainian", nameSelf: "Українська", name2: "uk", name3: "ukr", name3Self: "укр" }
]);

export const LANGUAGES_NAME_TYPES = Object.freeze({
    name: 'name',
    nameSelf: 'nameSelf',
    name2: 'name2',
    name3: 'name3',
    name3Self: 'name3Self'
});

export const LANGUAGES_NAME_MAP = (() => {
    const map = {};
    LANGUAGES.forEach(language => map[language.name] = language);
    return Object.freeze(map);
})();

export const LANGUAGES_NAME2_MAP = (() => {
    const map = {};
    LANGUAGES.forEach(language => map[language.name2] = language);
    return Object.freeze(map);
})();

export const LANGUAGES_NAME3_MAP = (() => {
    const map = {};
    LANGUAGES.forEach(language => map[language.name3] = language);
    return Object.freeze(map);
})();

export default {
    LANGUAGES_NAME_MAP,
    LANGUAGES_NAME2_MAP,
    LANGUAGES_NAME3_MAP
}