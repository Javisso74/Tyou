import Dictionary, { IDictionaryPair } from './Dictionary';
import { isUndefined } from './Util';

class LinkedDictionaryPair<K, V> implements IDictionaryPair<K, V> {
    public key: K;
    public value: V;
    public prev: LinkedDictionaryPair<K, V>;
    public next: LinkedDictionaryPair<K, V>;
    constructor(key?, value?) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }

    unlink() {
        this.prev.next = this.next;
        this.next.prev = this.prev;
    }
}

function isHeadOrTailLinkedDictionaryPair<K, V>(p: LinkedDictionaryPair<K, V>) {
    return p.next === null;
}

export default class LinkedDictionary<K, V> extends Dictionary<K, V> {
    private head: LinkedDictionaryPair<K, V>;
    private tail: LinkedDictionaryPair<K, V>;
    constructor(toStrFunction?: (key: K) => string) {
        super(toStrFunction);
        this.head = new LinkedDictionaryPair<K, V>();
        this.tail = new LinkedDictionaryPair<K, V>();
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }
    /**
     * Inserts the new node to the 'tail' of the list, updating the
     * neighbors, and moving 'this.tail' (the End of List indicator) that
     * to the end.
     */
    private appendToTail(entry) {
        var lastNode = this.tail.prev;
        lastNode.next = entry;
        entry.prev = lastNode;
        entry.next = this.tail;
        this.tail.prev = entry;
    }
    /**
     * Retrieves a linked dictionary from the table internally
     */
    private getLinkedDictionaryPair(key) {
        if (isUndefined(key)) {
            return undefined;
        }
        var k = '$' + this.toStr(key);
        var pair = this.table[k];
        return pair;
    }
    /**
     * Returns the value to which this dictionary maps the specified key.
     * Returns undefined if this dictionary contains no mapping for this key.
     * @param {Object} key key whose associated value is to be returned.
     * @return {*} the value to which this dictionary maps the specified key or
     * undefined if the map contains no mapping for this key.
     */
    getValue(key: K): V | undefined {
        var pair = this.getLinkedDictionaryPair(key);
        if (!isUndefined(pair)) {
            return pair.value;
        }
        return undefined;
    }
    /**
     * Removes the mapping for this key from this dictionary if it is present.
     * Also, if a value is present for this key, the entry is removed from the
     * insertion ordering.
     * @param {Object} key key whose mapping is to be removed from the
     * dictionary.
     * @return {*} previous value associated with specified key, or undefined if
     * there was no mapping for key.
     */
    remove(key: K): V | undefined {
        var pair = this.getLinkedDictionaryPair(key);
        if (!isUndefined(pair)) {
            super.remove.call(this, key); // This will remove it from the table
            (pair as LinkedDictionaryPair<K, V>)?.unlink(); // This will unlink it from the chain
            return pair.value;
        }
        return undefined;
    }
    /**
     * Removes all mappings from this LinkedDictionary.
     * @this {collections.LinkedDictionary}
     */
    clear(): void {
        super.clear.call(this);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }
    /**
     * Internal function used when updating an existing KeyValue pair.
     * It places the new value indexed by key into the table, but maintains
     * its place in the linked ordering.
     */
    private replace(oldPair, newPair) {
        var k = '$' + this.toStr(newPair.key);
        // set the new Pair's links to existingPair's links
        newPair.next = oldPair.next;
        newPair.prev = oldPair.prev;
        // Delete Existing Pair from the table, unlink it from chain.
        // As a result, the nElements gets decremented by this operation
        this.remove(oldPair.key);
        // Link new Pair in place of where oldPair was,
        // by pointing the old pair's neighbors to it.
        newPair.prev.next = newPair;
        newPair.next.prev = newPair;
        this.table[k] = newPair;
        // To make up for the fact that the number of elements was decremented,
        // We need to increase it by one.
        ++this.nElements;
    }
    /**
     * Associates the specified value with the specified key in this dictionary.
     * If the dictionary previously contained a mapping for this key, the old
     * value is replaced by the specified value.
     * Updating of a key that already exists maintains its place in the
     * insertion order into the map.
     * @param {Object} key key with which the specified value is to be
     * associated.
     * @param {Object} value value to be associated with the specified key.
     * @return {*} previous value associated with the specified key, or undefined if
     * there was no mapping for the key or if the key/value are undefined.
     */
    setValue(key: K, value: V): V | undefined {
        if (isUndefined(key) || isUndefined(value)) {
            return undefined;
        }
        var existingPair = this.getLinkedDictionaryPair(key);
        var newPair = new LinkedDictionaryPair<K, V>(key, value);
        var k = '$' + this.toStr(key);
        // If there is already an element for that key, we
        // keep it's place in the LinkedList
        if (!isUndefined(existingPair)) {
            this.replace(existingPair, newPair);
            return existingPair.value;
        } else {
            this.appendToTail(newPair);
            this.table[k] = newPair;
            ++this.nElements;
            return undefined;
        }
    }
    /**
     * Returns an array containing all of the keys in this LinkedDictionary, ordered
     * by insertion order.
     * @return {Array} an array containing all of the keys in this LinkedDictionary,
     * ordered by insertion order.
     */
    keys(): K[] {
        var array = [];
        this.forEach(function (key, value) {
            array.push(key);
        });
        return array;
    }
    /**
     * Returns an array containing all of the values in this LinkedDictionary, ordered by
     * insertion order.
     * @return {Array} an array containing all of the values in this LinkedDictionary,
     * ordered by insertion order.
     */
    values(): V[] {
        var array = [];
        this.forEach(function (key, value) {
            array.push(value);
        });
        return array;
    }
    /**
     * Executes the provided function once for each key-value pair
     * present in this LinkedDictionary. It is done in the order of insertion
     * into the LinkedDictionary
     * @param {function(Object,Object):*} callback function to execute, it is
     * invoked with two arguments: key and value. To break the iteration you can
     * optionally return false.
     */
    forEach(callback: (key: K, value: V) => any): void {
        var crawlNode = this.head.next;
        while (!isHeadOrTailLinkedDictionaryPair(crawlNode)) {
            var ret = callback(crawlNode.key, crawlNode.value);
            if (ret === false) {
                return;
            }
            crawlNode = crawlNode.next;
        }
    }
}
