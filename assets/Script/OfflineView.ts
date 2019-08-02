import GameManager from "./GameManager";
import { saveName } from "./Interface";
import { T_Item } from "./Data/T_Item";
import showBoxItem_min_Component from "./ItemComponent/showBoxItem_min_Component";

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
        this.scoreLab.string = score + "";

        if (itemList) {
            this.showNewItemContetn.active = true;
            this.newItemNode.active = true;
            for (let i = 0; i < itemList.length; i++) {
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
        this.scoreNode.active = false;
        this.offlineNode.active = true;
        this._income = GameManager.getInstance().getOfflineIncome();
        this.incomeLab.string = this._income + "";
    }

    //收集
    onclickCollect() {
        cc.log('收集到金币-->>', this._income);
        let current = GameManager.getInstance().getUserCount();
        let total = this._income + Number(current);
        GameManager.getInstance().saveData(saveName.USERCOUNT, total);
        GameManager.getInstance().saveData(saveName.PRETIME, Date.now());
        //退出
        this.node.active = false;
    }
}
