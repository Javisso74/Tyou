import List from './List';
import { defaultToString, has, isUndefined } from './Util';

export interface IDictionaryPair<K, V> {
    key: K;
    value: V;
}
export default class Dictionary<K, V> {
    /**
     * Object holding the key-value pairs.
     * @type {Object}
     * @private
     */
    protected table: {
        [key: string]: IDictionaryPair<K, V>;
    };
    /**
     * Number of elements in the list.
     * @type {number}
     * @private
     */
    protected nElements: number;
    /**
     * Function used to convert keys to strings.
     * @type {function(Object):string}
     * @protected
     */
    protected toStr: (key: K) => string;
    /**
     * Creates an empty dictionary.
     * @class <p>Dictionaries map keys to values; each key can map to at most one value.
     * This implementation accepts any kind of objects as keys.</p>
     *
     * <p>If the keys are custom objects a function which converts keys to unique
     * strings must be provided. Example:</p>
     * <pre>
     * function petToString(pet) {
     *  return pet.name;
     * }
     * </pre>
     * @constructor
     * @param {function(Object):string=} toStrFunction optional function used
     * to convert keys to strings. If the keys aren't strings or if toString()
     * is not appropriate, a custom function which receives a key and returns a
     * unique string must be provided.
     */
    constructor(toStrFunction?: (key: K) => string) {
        this.table = {};
        this.nElements = 0;
        this.toStr = toStrFunction || defaultToString;
    }
    /**
     * Returns the value to which this dictionary maps the specified key.
     * Returns undefined if this dictionary contains no mapping for this key.
     * @param {Object} key key whose associated value is to be returned.
     * @return {*} the value to which this dictionary maps the specified key or
     * undefined if the map contains no mapping for this key.
     */
    getValue(key: K): V | undefined {
        var pair = this.table['$' + this.toStr(key)];
        if (isUndefined(pair)) {
            return undefined;
        }
        return pair.value;
    }
    /**
     * Associates the specified value with the specified key in this dictionary.
     * If the dictionary previously contained a mapping for this key, the old
     * value is replaced by the specified value.
     * @param {Object} key key with which the specified value is to be
     * associated.
     * @param {Object} value value to be associated with the specified key.
     * @return {*} previous value associated with the specified key, or undefined if
     * there was no mapping for the key or if the key/value are undefined.
     */
    add(key: K, value: V): V | undefined {
        return this.setValue(key, value);
    }
    setValue(key: K, value: V): V | undefined {
        if (isUndefined(key) || isUndefined(value)) {
            return undefined;
        }
        var ret;
        var k = '$' + this.toStr(key);
        var previousElement = this.table[k];
        if (isUndefined(previousElement)) {
            this.nElements++;
            ret = undefined;
        } else {
            ret = previousElement.value;
        }
        this.table[k] = {
            key: key,
            value: value,
        };
        return ret;
    }
    /**
     * Removes the mapping for this key from this dictionary if it is present.
     * @param {Object} key key whose mapping is to be removed from the
     * dictionary.
     * @return {*} previous value associated with specified key, or undefined if
     * there was no mapping for key.
     */
    remove(key: K): V | undefined {
        var k = '$' + this.toStr(key);
        var previousElement = this.table[k];
        if (!isUndefined(previousElement)) {
            delete this.table[k];
            this.nElements--;
            return previousElement.value;
        }
        return undefined;
    }
    /**
     * Returns an array containing all of the keys in this dictionary.
     * @return {Array} an array containing all of the keys in this dictionary.
     */
    keys(): K[] {
        var array = [];
        for (var name_1 in this.table) {
            if (has(this.table, name_1)) {
                var pair = this.table[name_1];
                array.push(pair.key);
            }
        }
        return array;
    }
    /**
     * Returns an array containing all of the values in this dictionary.
     * @return {Array} an array containing all of the values in this dictionary.
     */
    values(): V[] {
        var array = [];
        for (var name_2 in this.table) {
            if (has(this.table, name_2)) {
                var pair = this.table[name_2];
                array.push(pair.value);
            }
        }
        return array;
    }

    toValueArray(): V[] {
        return this.values();
    }

    toValueList(): List<V> {
        var list = new List<V>();
        for (var name_2 in this.table) {
            if (has(this.table, name_2)) {
                var pair = this.table[name_2];
                list.add(pair.value);
            }
        }
        return list;
    }

    filterList(callback: (key: K, value: V) => any) {
        var list = new List<V>();
        for (var name_2 in this.table) {
            if (has(this.table, name_2)) {
                var pair = this.table[name_2];
                var ret = callback(pair.key, pair.value);
                if (ret === true) {
                    list.add(pair.value);
                }
            }
        }
        return list;
    }
    /**
     * Executes the provided function once for each key-value pair
     * present in this dictionary.
     * @param {function(Object,Object):*} callback function to execute, it is
     * invoked with two arguments: key and value. To break the iteration you can
     * optionally return false.
     */
    forEach(callback: (key: K, value: V) => any): void {
        for (var name_3 in this.table) {
            if (has(this.table, name_3)) {
                var pair = this.table[name_3];
                var ret = callback(pair.key, pair.value);
                if (ret === false) {
                    return;
                }
            }
        }
    }
    /**
     * Returns true if this dictionary contains a mapping for the specified key.
     * @param {Object} key key whose presence in this dictionary is to be
     * tested.
     * @return {boolean} true if this dictionary contains a mapping for the
     * specified key.
     */
    containsKey(key: K): boolean {
        return !isUndefined(this.getValue(key));
    }
    /**
     * Removes all mappings from this dictionary.
     * @this {collections.Dictionary}
     */
    clear(): void {
        this.table = {};
        this.nElements = 0;
    }
    /**
     * Returns the number of keys in this dictionary.
     * @return {number} the number of key-value mappings in this dictionary.
     */
    size(): number {
        return this.nElements;
    }
    /**
     * Returns true if this dictionary contains no mappings.
     * @return {boolean} true if this dictionary contains no mappings.
     */
    isEmpty(): boolean {
        return this.nElements <= 0;
    }
    toString(): string {
        var toret = '{';
        this.forEach(function (k, v) {
            toret += '\n\t' + k + ' : ' + v;
        });
        return toret + '\n}';
    }

    removeAll(predicate: (key: K, value: V) => boolean): K[] {
        const removedKeys: K[] = [];

        for (const name in this.table) {
            if (has(this.table, name)) {
                const pair = this.table[name];
                if (predicate(pair.key, pair.value)) {
                    removedKeys.push(pair.key);
                }
            }
        }

        // 统一删除
        removedKeys.forEach(key => {
            this.remove(key);
        });

        return removedKeys;
    }
    
}
