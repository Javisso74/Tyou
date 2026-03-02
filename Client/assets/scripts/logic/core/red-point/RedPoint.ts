export default class RedPoint {

    /** 节点名 */
    private _nodeName: string = null!;
    public set nodeName(s: string) { this._nodeName = s; }
    public get nodeName() { return this._nodeName; }

    /** 节点被经过的次数 */
    private _passCnt: number = 0;
    public set passCnt(n: number) { this._passCnt = n; }
    public get passCnt() { return this._passCnt; }

    /** 节点作为末尾节点的次数 */
    private _endCnt: number = 0;
    public set endCnt(n: number) { this._endCnt = n; }
    public get endCnt() { return this._endCnt; }

    /** 红点数 */
    private _redPointCnt: number = 0;
    public set redPointCnt(n: number) { this._redPointCnt = n; }
    public get redPointCnt() { return this._redPointCnt; }

    /** 子节点 */
    public children = {};

    /** 红点更新时回调, 支持多个回调*/
    public updateCb = {};

    constructor(...params: any) {
        this.nodeName = params[0];
    }
}


