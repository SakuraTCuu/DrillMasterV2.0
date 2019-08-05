const { ccclass, property } = cc._decorator;

@ccclass
export default class Cloud extends cc.Component {

    @property(cc.Node)
    cloud1Node: cc.Node = null;

    @property(cc.Node)
    cloud2Node: cc.Node = null;

    onLoad() {

    }

    start() {
        //开始运行 动作
        this.cloud3Anim();
        this.cloud4Anim();
    }

    cloud3Anim() {
        let movex = 1280;
        if (this.cloud1Node.x > 0) {
            movex = -1280;
        }
        let moveAct = cc.moveBy(120, cc.v2(movex, 0));
        const seq = cc.sequence(moveAct, cc.callFunc(this.cloud3Anim, this));
        this.cloud1Node.runAction(seq);
    }

    cloud4Anim() {
        let movex = 1280;
        if (this.cloud2Node.x > 0) {
            movex = -1280;
        }
        let moveAct = cc.moveBy(120, cc.v2(movex, 0));
        const seq = cc.sequence(moveAct, cc.callFunc(this.cloud3Anim, this));
        this.cloud2Node.runAction(seq);
    }
}
