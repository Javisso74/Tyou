/*
import { _decorator } from "cc";
import { ecs } from "../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { CCVMParentComp } from "../../../extensions/oops-plugin-framework/assets/module/common/CCVMParentComp";
import { oops } from "../../../extensions/oops-plugin-framework/assets/core/Oops";
import { RedPointConfig } from "./RedPointConfig";

const { ccclass, property } = _decorator;

/!** 视图层对象 - 支持 MVVM 框架的数据绑定 *!/
@ccclass('RPViewComp')
@ecs.register('RPView', false)
export class RPViewComp extends CCVMParentComp {
    @property({
        tooltip: '是否启编辑器添加路径'
    })
    templateMode: boolean = true;

    @property({
        visible() {
            // @ts-ignore
            return this.templateMode === true;
        }
    })
    path: string = '';

    /!** 脚本控制的界面 MVVM 框架绑定数据 *!/
    data: any = {num: 0};

    /!** 视图层逻辑代码分离演示 *!/
    start() {
    }

    onLoad(): void {
        /!** 设置红点回调 *!/
        if(this.templateMode){
            //@ts-ignore
            oops.rp.setCb(RedPointConfig[this.path], this.path, (num: number) => {
                this.data.num = num;
            });
            //@ts-ignore
            this.data.num = oops.rp.getRedPointCnt(RedPointConfig[this.path]);
        }
        super.onLoad();
    }

    setPath(path: string){
        this.path = path;
        //@ts-ignore
        oops.rp.setCb(RedPointConfig[this.path], this.path, (num: number) => {
            this.data.num = num;
        });
        //@ts-ignore
        this.data.num = oops.rp.getRedPointCnt(RedPointConfig[this.path]);
    }

    protected onDestroy(): void {
        /!** 清除红点回调 *!/
        //@ts-ignore
        oops.rp.setCb(RedPointConfig[this.path], this.path, null);
    }

    /!** 视图对象通过 ecs.Entity.remove(ModuleViewComp) 删除组件是触发组件处理自定义释放逻辑 *!/
    reset() {
        this.node.destroy();
    }
}*/
