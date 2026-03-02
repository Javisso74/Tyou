import {_decorator, Component, Node, Sprite, Label} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('LoadingUI')
export class LoadingUI extends Component {
    @property({type: Sprite, displayName: "进度条"})
    public slider: Sprite = null;

    @property({type: Label, displayName: "加载内容"})
    public content: Label;

    @property({type: Label, displayName: "加载进度"})
    public progress: Label;

    private static _instance: LoadingUI;

    public static get Instance() {
        return this._instance;
    }

    override onLoad() {
        LoadingUI._instance = this;
        this.updateProgress(1, 0, 1, "准备加载...");
    }
    
    public updateProgress(stage: number, current: number, total: number, message?: string) {
        // 计算百分比
        const percent = total > 0 ? Math.floor((current / total) * 100) : 0;

        if (stage === 1) {
            // 第一阶段：加载bundle
            this.content.string = message || "加载资源中";
            this.progress.string = `${current}/${total} (${percent}%)`;
        } else if (stage === 2) {
            // 第二阶段：加载表格
            this.content.string = message || "加载表格中";
            this.progress.string = `${current}/${total} (${percent}%)`;
        } else {
            this.content.string = message;
            this.progress.string = `${current}/${total} (${percent}%)`;
        }

        // 更新进度条
        if (this.slider) {
            this.slider.fillRange = total > 0 ? current / total : 0;
        }
    }

    public finishProgress(){
        this.node.destroy();
    }
}


