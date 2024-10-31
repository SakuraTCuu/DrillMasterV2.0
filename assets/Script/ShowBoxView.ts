import { T_Unlock, T_Unlock_Table } from "./Data/T_Unlock";
import showBoxItem_Component from "./ItemComponent/showBoxItem_Component";
import Helloworld from "./Helloworld";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShowBoxView extends cc.Component {

    @property(cc.Node)
    contetnNode: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    onLoad() {
    }

    // onEnable() {
    //     this.scheduleOnce(() => {
    //         // this.node.position = cc.v2(0, this.node.y + this.node.height);
    //         let moveAct = cc.moveTo(0.5, cc.v2(0, 0));
    //         this.node.runAction(moveAct);
    //     }, 1)
    // }\

    onEnable() {
        this.contetnNode.removeAllChildren();
        let drillList = T_Unlock_Table.getAllVo();
        let i = 1;
        this.schedule(() => {
            // for (let i = 0; i < drillList.length; i++) {
            let unlock = drillList[i];
            let item = cc.instantiate(this.itemPrefab);
            item.getComponent(showBoxItem_Component).init(unlock.id, unlock);
            this.contetnNode.addChild(item);
            i++;
            // }
        }, 0.02, drillList.length - 2, 0);
    }

    onClickExit() {
        cc.Canvas.instance.node.getComponent(Helloworld).clickCloseAudio();
        //退出动画
        let moveAct = cc.moveTo(0.5, cc.v2(this.node.x, this.node.y + this.node.height)).easing(cc.easeIn(3.0));
        let seqAct = cc.sequence(moveAct, cc.callFunc(() => {
            this.node.active = false;
        }))
        this.node.runAction(seqAct);
    }
}
