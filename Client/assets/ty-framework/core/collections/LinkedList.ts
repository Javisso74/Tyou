import {arrayToString, defaultEquals, IEqualsFunction, ILoopFunction, isUndefined} from './Util';

export interface ILinkedListNode<T> {
    element: T;
    next: ILinkedListNode<T> | null;
}

export default class LinkedList<T> {
    /**
     * First node in the list
     * @type {Object}
     * @private
     */
    firstNode: ILinkedListNode<T> | null;
    /**
     * Last node in the list
     * @type {Object}
     * @private
     */
    private lastNode;
    /**
     * Number of elements in the list
     * @type {number}
     * @private
     */
    private nElements;

    /**
     * Creates an empty Linked List.
     * @class A linked list is a data structure consisting of a group of nodes
     * which together represent a sequence.
     * @constructor
     */
    constructor() {
        /**
         * First node in the list
         * @type {Object}
         * @private
         */
        this.firstNode = null;
        /**
         * Last node in the list
         * @type {Object}
         * @private
         */
        this.lastNode = null;
        /**
         * Number of elements in the list
         * @type {number}
         * @private
         */
        this.nElements = 0;
    }

    /**
     * Adds an element to this list.
     * @param {Object} item element to be added.
     * @param {number=} index optional index to add the element. If no index is specified
     * the element is added to the end of this list.
     * @return {boolean} true if the element was added or false if the index is invalid
     * or if the element is undefined.
     */
    add(item: T, index?: number): boolean {
        if (isUndefined(index)) {
            index = this.nElements;
        }
        if (index < 0 || index > this.nElements || isUndefined(item)) {
            return false;
        }
        var newNode = this.createNode(item);
        if (this.nElements === 0 || this.lastNode === null) {
            // First node in the list.
            this.firstNode = newNode;
            this.lastNode = newNode;
        } else if (index === this.nElements) {
            // Insert at the end.
            this.lastNode.next = newNode;
            this.lastNode = newNode;
        } else if (index === 0) {
            // Change first node.
            newNode.next = this.firstNode;
            this.firstNode = newNode;
        } else {
            var prev = this.nodeAtIndex(index - 1);
            if (prev === null) {
                return false;
            }
            newNode.next = prev.next;
            prev.next = newNode;
        }
        this.nElements++;
        return true;
    }

    /**
     * Returns the first element in this list.
     * @return {*} the first element of the list or undefined if the list is
     * empty.
     */
    firstElement(): T | undefined {
        return this.firstNode?.element;
    }

    /**
     * 获取链表的第一个节点，可用于遍历链表
     * @returns {ILinkedListNode<T> | null} 第一个节点，如果链表为空则返回 null
     */
    first(): ILinkedListNode<T> | null {
        return this.firstNode;
    }

    /**
     * Returns the last element in this list.
     * @return {*} the last element in the list or undefined if the list is
     * empty.
     */
    lastElement(): T | undefined {
        if (this.lastNode !== null) {
            return this.lastNode.element;
        }
        return undefined;
    }

    last(): ILinkedListNode<T> | null {
        return this.lastNode
    }

    /**
     * Returns the element at the specified position in this list.
     * @param {number} index desired index.
     * @return {*} the element at the given index or undefined if the index is
     * out of bounds.
     */
    elementAtIndex(index: number): T | undefined {
        var node = this.nodeAtIndex(index);
        if (node === null) {
            return undefined;
        }
        return node.element;
    }

    /**
     * Returns the index in this list of the first occurrence of the
     * specified element, or -1 if the List does not contain this element.
     * <p>If the elements inside this list are
     * not comparable with the === operator a custom equals function should be
     * provided to perform searches, the function must receive two arguments and
     * return true if they are equal, false otherwise. Example:</p>
     *
     * <pre>
     * const petsAreEqualByName = function(pet1, pet2) {
     *  return pet1.name === pet2.name;
     * }
     * </pre>
     * @param {Object} item element to search for.
     * @param {function(Object,Object):boolean=} equalsFunction Optional
     * function used to check if two elements are equal.
     * @return {number} the index in this list of the first occurrence
     * of the specified element, or -1 if this list does not contain the
     * element.
     */
    indexOf(item: T, equalsFunction?: IEqualsFunction<T>): number {
        var equalsF = equalsFunction || defaultEquals;
        if (isUndefined(item)) {
            return -1;
        }
        var currentNode = this.firstNode;
        var index = 0;
        while (currentNode !== null) {
            if (equalsF(currentNode.element, item)) {
                return index;
            }
            index++;
            currentNode = currentNode.next;
        }
        return -1;
    }

    /**
     * Returns true if this list contains the specified element.
     * <p>If the elements inside the list are
     * not comparable with the === operator a custom equals function should be
     * provided to perform searches, the function must receive two arguments and
     * return true if they are equal, false otherwise. Example:</p>
     *
     * <pre>
     * const petsAreEqualByName = function(pet1, pet2) {
     *  return pet1.name === pet2.name;
     * }
     * </pre>
     * @param {Object} item element to search for.
     * @param {function(Object,Object):boolean=} equalsFunction Optional
     * function used to check if two elements are equal.
     * @return {boolean} true if this list contains the specified element, false
     * otherwise.
     */
    contains(item: T, equalsFunction?: IEqualsFunction<T>): boolean {
        return this.indexOf(item, equalsFunction) >= 0;
    }

    /**
     * Removes the first occurrence of the specified element in this list.
     * <p>If the elements inside the list are
     * not comparable with the === operator a custom equals function should be
     * provided to perform searches, the function must receive two arguments and
     * return true if they are equal, false otherwise. Example:</p>
     *
     * <pre>
     * const petsAreEqualByName = function(pet1, pet2) {
     *  return pet1.name === pet2.name;
     * }
     * </pre>
     * @param {Object} item element to be removed from this list, if present.
     * @return {boolean} true if the list contained the specified element.
     */
    remove(item: T, equalsFunction?: IEqualsFunction<T>): boolean {
        var equalsF = equalsFunction || defaultEquals;
        if (this.nElements < 1 || isUndefined(item)) {
            return false;
        }
        var previous = null;
        var currentNode = this.firstNode;
        while (currentNode !== null) {
            if (equalsF(currentNode.element, item)) {
                if (previous === null) {
                    this.firstNode = currentNode.next;
                    if (currentNode === this.lastNode) {
                        this.lastNode = null;
                    }
                } else if (currentNode === this.lastNode) {
                    this.lastNode = previous;
                    previous.next = currentNode.next;
                    currentNode.next = null;
                } else {
                    previous.next = currentNode.next;
                    currentNode.next = null;
                }
                this.nElements--;
                return true;
            }
            previous = currentNode;
            currentNode = currentNode.next;
        }
        return false;
    }

    /**
     * Removes all of the elements from this list.
     */
    clear(): void {
        this.firstNode = null;
        this.lastNode = null;
        this.nElements = 0;
    }

    /**
     * Returns true if this list is equal to the given list.
     * Two lists are equal if they have the same elements in the same order.
     * @param {LinkedList} other the other list.
     * @param {function(Object,Object):boolean=} equalsFunction optional
     * function used to check if two elements are equal. If the elements in the lists
     * are custom objects you should provide a function, otherwise
     * the === operator is used to check equality between elements.
     * @return {boolean} true if this list is equal to the given list.
     */
    equals(other: any, equalsFunction?: IEqualsFunction<T>): boolean {
        var eqF = equalsFunction || defaultEquals;
        if (!(other instanceof LinkedList)) {
            return false;
        }
        if (this.size() !== other.size()) {
            return false;
        }
        return this.equalsAux(this.firstNode, other.firstNode, eqF);
    }

    /**
     * @private
     */
    private equalsAux(n1, n2, eqF) {
        while (n1 !== null && n2 !== null) {
            if (!eqF(n1.element, n2.element)) {
                return false;
            }
            n1 = n1.next;
            n2 = n2.next;
        }
        return true;
    }

    /**
     * Removes the element at the specified position in this list.
     * @param {number} index given index.
     * @return {*} removed element or undefined if the index is out of bounds.
     */
    removeElementAtIndex(index: number): T | undefined {
        if (index < 0 || index >= this.nElements || this.firstNode === null || this.lastNode === null) {
            return undefined;
        }
        var element;
        if (this.nElements === 1) {
            //First node in the list.
            element = this.firstNode.element;
            this.firstNode = null;
            this.lastNode = null;
        } else {
            var previous = this.nodeAtIndex(index - 1);
            if (previous === null) {
                element = this.firstNode.element;
                this.firstNode = this.firstNode.next;
            } else if (previous.next === this.lastNode) {
                element = this.lastNode.element;
                this.lastNode = previous;
            }
            if (previous !== null && previous.next !== null) {
                element = previous.next.element;
                previous.next = previous.next.next;
            }
        }
        this.nElements--;
        return element;
    }

    /**
     * Executes the provided function once for each element present in this list in order.
     * @param {function(Object):*} callback function to execute, it is
     * invoked with one argument: the element value, to break the iteration you can
     * optionally return false.
     */
    forEach(callback: ILoopFunction<T>): void {
        var currentNode = this.firstNode;
        while (currentNode !== null) {
            if (callback(currentNode.element) === false) {
                break;
            }
            currentNode = currentNode.next;
        }
    }

    /**
     * Reverses the order of the elements in this linked list (makes the last
     * element first, and the first element last).
     */
    reverse(): void {
        var previous = null;
        var current = this.firstNode;
        var temp = null;
        while (current !== null) {
            temp = current.next;
            current.next = previous;
            previous = current;
            current = temp;
        }
        temp = this.firstNode;
        this.firstNode = this.lastNode;
        this.lastNode = temp;
    }

    /**
     * Returns an array containing all of the elements in this list in proper
     * sequence.
     * @return {Array.<*>} an array containing all of the elements in this list,
     * in proper sequence.
     */
    toArray(): T[] {
        var array = [];
        var currentNode = this.firstNode;
        while (currentNode !== null) {
            array.push(currentNode.element);
            currentNode = currentNode.next;
        }
        return array;
    }

    /**
     * Returns the number of elements in this list.
     * @return {number} the number of elements in this list.
     */
    size(): number {
        return this.nElements;
    }

    /**
     * Returns true if this list contains no elements.
     * @return {boolean} true if this list contains no elements.
     */
    isEmpty(): boolean {
        return this.nElements <= 0;
    }

    toString(): string {
        return arrayToString(this.toArray());
    }

    /**
     * @private
     */
    private nodeAtIndex(index) {
        if (index < 0 || index >= this.nElements) {
            return null;
        }
        if (index === this.nElements - 1) {
            return this.lastNode;
        }
        var node = this.firstNode;
        for (var i = 0; i < index && node !== null; i++) {
            node = node.next;
        }
        return node;
    }

    /**
     * @private
     */
    private createNode(item) {
        return {
            element: item,
            next: null,
        };
    }

    /**
     * 在链表末尾高效添加元素
     * 时间复杂度: O(1)
     * @param {T} item 要添加的元素
     * @returns {boolean} 添加是否成功
     */
    addLast(item: T): boolean {
        if (isUndefined(item)) {
            return false;
        }

        const newNode = this.createNode(item);

        if (this.nElements === 0) {
            // 空链表，设置为首尾节点
            this.firstNode = newNode;
            this.lastNode = newNode;
        } else {
            // 非空链表，直接添加到尾部
            if (this.lastNode) {
                this.lastNode.next = newNode;
                this.lastNode = newNode;
            }
        }

        this.nElements++;
        return true;
    }

    /**
     * 在指定节点前插入元素（基于节点引用，最优雅的实现）
     * 注意：此方法假设调用者持有有效的节点引用
     * 时间复杂度: O(n) 需要找到前驱节点
     * @param {ILinkedListNode<T>} refNode 参考节点
     * @param {T} item 要插入的元素
     * @returns {ILinkedListNode<T> | null} 新插入的节点，失败返回 null
     */
    addBefore(refNode: ILinkedListNode<T>, item: T): ILinkedListNode<T> | null {
        if (!refNode || isUndefined(item)) {
            return null;
        }

        // 特殊情况：插入到链表头部
        if (refNode === this.firstNode) {
            const newNode = this.createNode(item);
            newNode.next = this.firstNode;
            this.firstNode = newNode;

            if (this.nElements === 0) {
                this.lastNode = newNode;
            }

            this.nElements++;
            return newNode;
        }

        // 找到前驱节点
        const prevNode = this.findPreviousNode(refNode);
        if (!prevNode) {
            return null; // refNode 不在链表中
        }

        // 插入新节点
        const newNode = this.createNode(item);
        newNode.next = refNode;
        prevNode.next = newNode;

        this.nElements++;
        return newNode;
    }

    /**
     * 查找指定节点的前驱节点
     * 时间复杂度: O(n)
     * @param {ILinkedListNode<T>} node 目标节点
     * @returns {ILinkedListNode<T> | null} 前驱节点，未找到返回 null
     */
    private findPreviousNode(node: ILinkedListNode<T>): ILinkedListNode<T> | null {
        let current = this.firstNode;
        let prev = null;

        while (current && current !== node) {
            prev = current;
            current = current.next;
        }

        return current === node ? prev : null;
    }
}
