import Helloworld from "./Helloworld";
import GameManager from "./GameManager";
import { saveName } from "./Interface";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaoxiangView extends cc.Component {

    @property(cc.Label)
    incomeLab: cc.Label = null;

    @property(cc.Label)
    desLab: cc.Label = null;

    @property(cc.Node)
    GuideMask: cc.Node = null;

    _income: number = 0;

    showView(income: number, isGuide: boolean = false) {
        if (isGuide) {
            //展示
            this.GuideMask.active = true;
        } else {
            this.GuideMask.active = false;
        }
        this._income = income;
        this.incomeLab.string = "$" + this._income;
        let disMoney = Number(Number(20 - this._income).toFixed(2));
        this.desLab.string = "$" + disMoney;
    }

    onClickClose() {
        //关闭当前界面
        this.node.active = false;
        cc.Canvas.instance.node.getComponent(Helloworld).clickCloseAudio();
    }

    onClickCollect() {
        //兑换  这里应该永远不会实现 兑钱的真逻辑
        return;
        //收集  这里应该是真钱
        cc.log('收集到金币-->>', this._income);
        cc.Canvas.instance.node.getComponent(Helloworld).playCollectMoneyAudio();
        let current = GameManager.getInstance().getUserCount();
        let total = this._income + Number(current);
        GameManager.getInstance().saveData(saveName.USERCOUNT, total);
        this.node.active = false;
    }

    onClickDouble() {
        //双倍
        cc.log("click double");
    }
}
