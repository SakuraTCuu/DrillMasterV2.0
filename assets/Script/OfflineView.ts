import GameManager from "./GameManager";
import { saveName, NotifyEnum, ADTYPE, Statistics } from "./Interface";
import { T_Item } from "./Data/T_Item";
import showBoxItem_min_Component from "./ItemComponent/showBoxItem_min_Component";
import { _Notification_ } from "./_Notification_";
import Helloworld from "./Helloworld";

const { ccclass, property } = cc._decorator;

@ccclass
export default class OfflineView extends cc.Component {

    @property(cc.Node)
    showNewItemContetn: cc.Node = null;

    @property(cc.Node)
    newItemNode: cc.Node = null;

    @property(cc.Prefab)
    itemPre: cc.Prefab = null;

    @property(cc.Node)
    offlineNode: cc.Node = null;

    @property(cc.Node)
    scoreNode: cc.Node = null;

    @property(cc.Label)
    scoreLab: cc.Label = null;

    @property(cc.Label)
    incomeLab: cc.Label = null;

    //n倍
    @property(cc.Label)
    timesLab: cc.Label = null;

    @property(cc.Button)
    collectBtn: cc.Button = null;

    @property(cc.Button)
    doubleBtn: cc.Button = null;

    _times: number = 0;
    _income: number = 0;
    showScore(score: number, itemList: Array<T_Item> = null) {
        this.scoreNode.active = true;
        this.offlineNode.active = false;
        this._income = score;
        this.scoreLab.string = "$" + score;
        this.showDoubleAnim();
        this.setTimesLab();

        if (itemList && itemList.length > 0) {
            this.showNewItemContetn.removeAllChildren();
            this.showNewItemContetn.active = true;
            this.newItemNode.active = true;
            let len = itemList.length;
            if (len >= 4) {
                len = 4;
            }
            for (let i = 0; i < len; i++) {
                let itemVo = itemList[i];
                let item = cc.instantiate(this.itemPre);
                item.getComponent(showBoxItem_min_Component).setData(itemVo.id + "");
                this.showNewItemContetn.addChild(item);
            }
        } else {
            this.showNewItemContetn.active = false;
            this.newItemNode.active = false;
        }
    }

    showOffline() {
        this.setTimesLab();
        cc.log("离线收益-->>", this._income);
        this.scoreNode.active = false;
        this.offlineNode.active = true;
        this._income = GameManager.getInstance().getOfflineIncome();
        this.incomeLab.string = "$" + this._income;
    }

    //收集
    onclickCollect() {
        cc.log('收集到金币-->>', this._income);
        cc.Canvas.instance.node.getComponent(Helloworld).playCollectMoneyAudio();
        let current = GameManager.getInstance().getUserCount();
        let total = this._income + Number(current);
        GameManager.getInstance().saveData(saveName.USERCOUNT, total);
        // GameManager.getInstance().saveData(saveName.PRETIME, Date.now());
        // _Notification_.send(NotifyEnum.CLICKCOLLECT, 1);
        //退出
        this.node.active = false;
    }

    /**
     * 双倍奖励   多倍奖励
     */
    onDoubleCollect() {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            GameManager.income = this._income * this._times;
            GameManager.playAdVideo(1);
            GameManager.Statistics(Statistics.AD_CLICK);
        } else {
            cc.Canvas.instance.node.getComponent(Helloworld).playCollectMoneyAudio();
            let current = GameManager.getInstance().getUserCount();
            let total = this._income * this._times + Number(current);
            GameManager.getInstance().saveData(saveName.USERCOUNT, total);
            //退出
            this.node.active = false;
        }
    }

    //先展示双倍按钮,在展示获取按钮
    showDoubleAnim() {
        this.collectBtn.node.active = false;
        this.doubleBtn.node.active = true;

        let scaleAct1 = cc.scaleTo(0.5, 1.5);
        let scaleAct2 = cc.scaleTo(0.5, 1.0);
        let scaleAct3 = cc.scaleTo(0.5, 1.4);
        let scaleAct4 = cc.scaleTo(0.5, 1.3);
        let seqAct = cc.sequence(scaleAct1, scaleAct2, scaleAct3, scaleAct4, cc.callFunc(() => {
            this.collectBtn.node.active = true;
        }));
        this.doubleBtn.node.runAction(seqAct);
    }

    //设置n倍按钮
    setTimesLab() {
        // 1/5的几率获得n倍
        let times = 2;
        let rand = Math.random();
        if (rand <= 0.2) {  //随机一个倍数
            let rand2 = Math.random()
            if (rand2 <= 0.5) {
                times = 3;
            } else {
                times = 4;
            }
        } else {
            times = 2;
        }
        this._times = times;
        this.timesLab.string = "COLLECT x" + this._times;
    }
}
