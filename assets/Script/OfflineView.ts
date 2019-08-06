import GameManager from "./GameManager";
import { saveName, NotifyEnum } from "./Interface";
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

    _income: number = 0;

    showScore(score: number, itemList: Array<T_Item> = null) {
        this.scoreNode.active = true;
        this.offlineNode.active = false;
        this._income = score;
        this.scoreLab.string = "$" + score;

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
        _Notification_.send(NotifyEnum.CLICKCOLLECT, 1);
        //退出
        this.node.active = false;


        
    }
}
