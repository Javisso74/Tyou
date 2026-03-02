export function has(obj: any, prop: any): boolean {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

/**
 * Function signature for comparing
 * <0 means a is smaller
 * = 0 means they are equal
 * >0 means a is larger
 */
export interface ICompareFunction<T> {
    (a: T, b: T): number;
}
/**
 * Function signature for checking equality
 */
export interface IEqualsFunction<T> {
    (a: T, b: T): boolean;
}
/**
 * Function signature for Iterations. Return false to break from loop
 */
export interface ILoopFunction<T> {
    (a: T): boolean | void;
}

export interface IFindFunction<T> {
    (a: T): boolean;
}

export function defaultCompare(a, b) {
    if (a < b) {
        return -1;
    } else if (a === b) {
        return 0;
    } else {
        return 1;
    }
}

export function defaultEquals(a, b) {
    return a === b;
}

export function defaultFind(a) {
    return false;
}

export function defaultToString(item: any): string {
    if (item === null) {
        return 'COLLECTION_NULL';
    } else if (isUndefined(item)) {
        return 'COLLECTION_UNDEFINED';
    } else if (isString(item)) {
        return '$s' + item;
    } else {
        return '$o' + item.toString();
    }
}

export function makeString(item, join) {
    if (join === void 0) {
        join = ',';
    }
    if (item === null) {
        return 'COLLECTION_NULL';
    } else if (isUndefined(item)) {
        return 'COLLECTION_UNDEFINED';
    } else if (isString(item)) {
        return item.toString();
    } else {
        var toret = '{';
        var first = true;
        for (var prop in item) {
            if (has(item, prop)) {
                if (first) {
                    first = false;
                } else {
                    toret = toret + join;
                }
                toret = toret + prop + ':' + item[prop];
            }
        }
        return toret + '}';
    }
}

/**
 * Checks if the given argument is a function.
 * @function
 */
export function isFunction(func: any): boolean {
    return typeof func === 'function';
}
/**
 * Checks if the given argument is undefined.
 * @function
 */
export function isUndefined(obj: any): obj is undefined {
    return typeof obj === 'undefined';
}
/**
 * Checks if the given argument is a string.
 * @function
 */
export function isString(obj: any): boolean {
    return Object.prototype.toString.call(obj) === '[object String]';
}

export function reverseCompareFunction(compareFunction) {
    if (isUndefined(compareFunction) || !isFunction(compareFunction)) {
        return function (a, b) {
            if (a < b) {
                return 1;
            } else if (a === b) {
                return 0;
            } else {
                return -1;
            }
        };
    } else {
        return function (d, v) {
            return compareFunction(d, v) * -1;
        };
    }
}

export function compareToEquals(compareFunction) {
    return function (a, b) {
        return compareFunction(a, b) === 0;
    };
}

export function arrayToString(array) {
    return '[' + array.toString() + ']';
}
