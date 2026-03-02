import {
    defaultCompare,
    defaultEquals,
    defaultFind,
    ICompareFunction,
    IEqualsFunction,
    IFindFunction,
    ILoopFunction
} from './Util';

export default class List<T> {
    /**
     * Array used to store the elements of the heap.
     * @type {Array.<Object>}
     * @private
     */
    private data: Array<T>;

    /**
     * Creates an empty List.
     * @class  A list is a data array
     * @constructor
     * to convert keys to strings. If the keys aren't strings or if toString()
     * is not appropriate, a custom function which receives a key and returns a
     * unique string must be provided.
     */
    constructor() {
        this.data = new Array<T>();
    }

    index(idx: number): T {
        if (idx >= 0 && idx < this.data.length) {
            return this.data[idx];
        }

        return null;
    }

    replace(idx: number, item: T) {
        if (idx >= 0 && idx < this.data.length) {
            return (this.data[idx] = item);
        }
    }

    first() {
        if (this.data.length > 0) {
            return this.data[0];
        }

        return null;
    }

    last() {
        if (this.data.length > 0) {
            return this.data[this.data.length - 1];
        }
        return null;
    }

    /**
     * Returns the position of the first occurrence of the specified item
     * within the specified array.4
     * @param {Object} item the element to search.
     * @param {function(Object,Object):boolean=} equalsFunction optional function used to
     * check equality between 2 elements.
     * @return {number} the position of the first occurrence of the specified element
     * within the specified array, or -1 if not found.
     */
    indexOf(item: T, equalsFunction?: IEqualsFunction<T>) {
        var equals = equalsFunction || defaultEquals;
        var length = this.data.length;
        for (var i = 0; i < length; i++) {
            if (equals(this.data[i], item)) {
                return i;
            }
        }
        return -1;
    }

    find(findFunction?: IFindFunction<T>) {
        var equals = findFunction || defaultFind;
        var length = this.data.length;
        for (var i = 0; i < length; i++) {
            if (equals(this.data[i])) {
                return this.data[i];
            }
        }
        return null;
    }

    /**
     * Returns the position of the last occurrence of the specified element
     * within the specified array.
     * @param {Object} item the element to search.
     * @param {function(Object,Object):boolean=} equalsFunction optional function used to
     * check equality between 2 elements.
     * @return {number} the position of the last occurrence of the specified element
     * within the specified array or -1 if not found.
     */
    lastIndexOf<T>(item: T, equalsFunction?: IEqualsFunction<T>): number {
        var equals = equalsFunction || defaultEquals;
        var length = this.data.length;
        for (var i = length - 1; i >= 0; i--) {
            if (equals(this.data[i], item)) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Returns true if the specified array contains the specified element.
     * @param {Object} item the element to search.
     * @param {function(Object,Object):boolean=} equalsFunction optional function to
     * check equality between 2 elements.
     * @return {boolean} true if the specified array contains the specified element.
     */
    contains(item: T, equalsFunction?: IEqualsFunction<T>) {
        return this.indexOf(item, equalsFunction) >= 0;
    }

    /**
     * Inserts the specified element into the end of this queue.
     * @param {Object} elem the element to insert.
     * @return {boolean} true if the element was inserted, or false if it is undefined.
     */
    add(elem: T) {
        this.data.push(elem);
    }

    insert(elem: T, index: number) {
        this.data.splice(index, 0, elem);
    }

    /**
     * Removes the first ocurrence of the specified element from the specified array.
     * @param {Object} item the element to search.
     * @param {function(Object,Object):boolean=} equalsFunction optional function to
     * check equality between 2 elements.
     * @return {boolean} true if the array changed after this call.
     */
    remove(item: T, equalsFunction?: IEqualsFunction<T>) {
        var index = this.indexOf(item, equalsFunction);
        if (index < 0) {
            return false;
        }
        this.data.splice(index, 1);
        return true;
    }

    removeIndex(index: number) {
        if (index < 0) {
            return false;
        }
        this.data.splice(index, 1);
        return true;
    }

    /**
     * Returns the number of elements in the specified array equal
     * to the specified object.
     * @param {Object} item the element whose frequency is to be determined.
     * @param {function(Object,Object):boolean=} equalsFunction optional function used to
     * check equality between 2 elements.
     * @return {number} the number of elements in the specified array
     * equal to the specified object.
     */
    frequency(item: T, equalsFunction?: IEqualsFunction<T>) {
        var equals = equalsFunction || defaultEquals;
        var length = this.data.length;
        var freq = 0;
        for (var i = 0; i < length; i++) {
            if (equals(this.data[i], item)) {
                freq++;
            }
        }
        return freq;
    }

    /**
     * Returns true if the two specified arrays are equal to one another.
     * Two arrays are considered equal if both arrays contain the same number
     * of elements, and all corresponding pairs of elements in the two
     * arrays are equal and are in the same order.
     * @param {Array} array2 the other array to be tested for equality.
     * @param {function(Object,Object):boolean=} equalsFunction optional function used to
     * check equality between elemements in the arrays.
     * @return {boolean} true if the two arrays are equal
     */
    equals<T>(array2: List<T>, equalsFunction?: IEqualsFunction<T>) {
        var equals = equalsFunction || defaultEquals;
        if (this.size() !== array2.size()) {
            return false;
        }
        var length = this.size();
        for (var i = 0; i < length; i++) {
            if (!equals(this.data[i], array2.data[i])) {
                return false;
            }
        }
        return true;
    }

    /**
     * Removes all of the elements from this heap.
     */
    clear(): void {
        this.data.length = 0;
    }

    /**
     * Returns the number of elements in this heap.
     * @return {number} the number of elements in this heap.
     */
    size(): number {
        return this.data.length;
    }

    /**
     * Checks if this heap is empty.
     * @return {boolean} true if and only if this heap contains no items; false
     * otherwise.
     */
    isEmpty(): boolean {
        return this.data.length <= 0;
    }

    toString(): string {
        return '[' + this.data.toString() + ']';
    }

    sort(compareFunction?: ICompareFunction<T>) {
        var compares = compareFunction || defaultCompare;
        this.data.sort(compares);
    }

    copy() {
        let tmpCopy = new List<T>();
        this.forEach((item) => {
            tmpCopy.add(item);
        });

        return tmpCopy;
    }

    /**
     * Swaps the elements at the specified positions in the specified array.
     * @param {number} i the index of one element to be swapped.
     * @param {number} j the index of the other element to be swapped.
     * @return {boolean} true if the array is defined and the indexes are valid.
     */
    swap(i: number, j: number) {
        if (i < 0 || i >= this.data.length || j < 0 || j >= this.data.length) {
            return false;
        }
        var temp = this.data[i];
        this.data[i] = this.data[j];
        this.data[j] = temp;
        return true;
    }

    /**
     * Returns an array containing all of the elements in this list in proper
     * sequence.
     * @return {Array.<*>} an array containing all of the elements in this list,
     * in proper sequence.
     */
    toArray(): T[] {
        var array = [];
        for (let i = 0; i < this.data.length; i++) {
            array.push(this.data[i]);
        }
        return array;
    }

    /**
     * Executes the provided function once for each element present in this array
     * starting from index 0 to length - 1.
     * @param {function(Object):*} callback function to execute, it is
     * invoked with one argument: the element value, to break the iteration you can
     * optionally return false.
     */
    forEach(callback: ILoopFunction<T>): void {
        for (var _i = 0, array_1 = this.data; _i < array_1.length; _i++) {
            var ele = array_1[_i];
            if (callback(ele) === false) {
                return;
            }
        }
    }

    sub(len: number = 0) {
        this.data.splice(len);
    }

    concat(list: List<T>) {
        if (list) {
            list.forEach((val) => {
                this.add(val);
            });
        }
        return this;
    }

    //为了兼顾安全删除 如果没有顺序要求 直接用这个一劳永逸
    forEachReverse(callback: ILoopFunction<T>): void {
        for (let i = this.data.length - 1; i >= 0; i--) {
            if (callback(this.data[i]) === false) {
                return;
            }
  
        }
    }

}
