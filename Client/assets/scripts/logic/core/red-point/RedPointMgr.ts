import { _decorator, Component } from "cc";
import RedPoint from "./RedPoint";
import { RedPointConfig } from "./RedPointConfig";

const { ccclass, property } = _decorator;

@ccclass
export default class RedPointMgr{
    constructor(){
        this.init();
    }

    /** 根节点 用于统领全局，不作任何显示 */
    private root: RedPoint = null!;

    init() {
        this.root = new RedPoint('Root');

        /** 构建对应的红点结构 */
        for (const key in RedPointConfig) {
            if (Object.prototype.hasOwnProperty.call(RedPointConfig, key)) {
                //@ts-ignore
                const namePath = RedPointConfig[key];
                this.insertNode(namePath);
            }
        }
    }

    /**
     * 插入新的红点
     *
     * @param {string} namePath 红点路径
     * @return {*} 
     * @memberof RedPointTree
     */
    insertNode(namePath: string) {
        if (!namePath) {
            return;
        }

        //@ts-ignore
        if (this.searchNode[namePath]) {
            return;
        }

        let node = this.root;
        node.passCnt += 1;

        const names = namePath.split('|');
        names.forEach(name => {
            //@ts-ignore
            if (node.children[name] == null) {
                //@ts-ignore
                node.children[name] = new RedPoint(name);
            }
            //@ts-ignore
            node = node.children[name];
            node.passCnt += 1;
        });

        node.endCnt += 1;
    }

    /**
     * 查询红点
     *
     * @param {string} namePath 红点路径
     * @return {*}
     * @memberof RedPointTree
     */
    searchNode(namePath: string) {
        if (!namePath) {
            return;
        }

        let node: RedPoint = this.root;

        const names = namePath.split('|');
        names.forEach(name => {
            //@ts-ignore
            if (node.children[name] == null) {
                return null;
            }
            //@ts-ignore
            node = node.children[name];
        });

        if (node.endCnt > 0) {
            return node;
        }

        return null;
    }

    /**
     * 删除红点
     *
     * @param {string} namePath
     * @memberof RedPointTree
     */
    delNode(namePath: string) {
        if (!this.searchNode(namePath)) {
            return;
        }

        let node: RedPoint = this.root;
        node.passCnt -= 1;

        const names = namePath.split('|');
        names.forEach(name => {
            //@ts-ignore
            const childNode = node.children[name];
            childNode.passCnt -= 1;
            if (childNode.passCnt === 0) {
                //@ts-ignore
                node.children[name] = null;
                return;
            }
        });

        node.endCnt -= 1;
    }

    /**
     * 更新红点数量
     *
     * @param {string} namePath 路径
     * @param {number} num 数量
     * @memberof RedPointTree
     */
    updateRedPointCnt(namePath: string, num: number) {
        const targetNode = this.searchNode(namePath);
        if (targetNode == null) {
            return;
        }
        var dt = num - targetNode.redPointCnt;

        let node: RedPoint = this.root;
        const names = namePath.split('|');
        names.forEach(name => {
            //@ts-ignore
            const childNode = node.children[name];
            childNode.redPointCnt += dt;
            node = childNode;

            /** 红点数变化时的回调 */
            for (const key in node.updateCb) {
                if (Object.prototype.hasOwnProperty.call(node.updateCb, key)) {
                    //@ts-ignore
                    const cb = node.updateCb[key];
                    cb && cb(node.redPointCnt);
                }
            }
        });
    }

    /**
     * 设置回调方法
     *
     * @param {string} namePath 红点路径
     * @param {string} key 回调key值
     * @param {Function} cb 回调key值对应的方法
     * @return {*} 
     * @memberof RedPointTree
     */
    setCb(namePath: string, key: string, cb: Function) {
        const targetNode = this.searchNode(namePath);
        if (targetNode == null) {
            return;
        }

        //@ts-ignore
        targetNode.updateCb[key] = cb;
    }

    /**
     * 获取红点数量
     *
     * @param {string} namePath
     * @return {*} 
     * @memberof RedPointTree
     */
    getRedPointCnt(namePath: string) {
        const targetNode = this.searchNode(namePath);
        if (targetNode == null) {
            return 0;
        }

        return targetNode.redPointCnt;
    }
}
