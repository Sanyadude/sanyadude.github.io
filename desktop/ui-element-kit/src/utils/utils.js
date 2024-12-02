export const getIdGenerator = () => {
    let id = 0;
    return {
        current: () => id,
        next: () => ++id
    }
}

export const idGenerator = getIdGenerator();

export const camelToKebabCase = (string) => {
    return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

const instance = (name, parameter, type) => {
    if (parameter instanceof type) return;
    throw Error(`Parameter "${name}" should be instance of ${type.name}`);
}

const type = (name, parameter, type) => {
    if (typeof parameter === type) return;
    throw Error(`Parameter "${name}" should be type ${type}`);
}

export const getParameterValidator = () => {
    return {
        instance,
        type
    }
}

export const parameterValidator = getParameterValidator();

export const Utils = {
    idGenerator,
    parameterValidator,
    camelToKebabCase,
    getIdGenerator,
    getParameterValidator
}

export default Utils