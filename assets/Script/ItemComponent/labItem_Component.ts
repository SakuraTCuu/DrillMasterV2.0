import Helloworld from "../Helloworld";
import LoadUtils from "../Util/LoadUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class labItem_Component extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    init(isGold: boolean, str: number, isMove: boolean = false) {
        this.label.string = "$" + str + "";
        this.node.angle = 20;
        let moveAct = cc.moveBy(0.5, cc.v2(this.node.x, this.node.y + 200));
        let rotateAct = cc.rotateTo(1, 0);
        let fadeAct = cc.fadeOut(1);
        let spaAct;
        if (!isMove) {
            spaAct = cc.spawn(moveAct, rotateAct, fadeAct);
        } else {
            spaAct = cc.spawn(rotateAct, fadeAct);
        }
        let seqAct = cc.sequence(cc.delayTime(0.5), spaAct, cc.callFunc(() => {
            this.node.angle = 0;
            this.node.opacity = 255;
            this.node.position = cc.v2(0, 0);
            LoadUtils.labItemPool.put(this.node);
            this.node.removeFromParent();
        }));
        this.node.runAction(seqAct);
    }
}
