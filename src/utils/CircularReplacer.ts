/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value#examples
 * 
 * Allows for stringifying an object with circular references.
 * @returns 
 */
const getCircularReplacer: any = () => {
    const seen = new WeakSet();

    return (key: any, value: any) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
};

export default getCircularReplacer;
