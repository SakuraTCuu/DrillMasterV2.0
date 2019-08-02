import { T_Unlock } from "../Data/T_unlock";
import showBoxItem_min_Component from "./showBoxItem_min_Component";
import GameManager from "../GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class showBoxItem_Component extends cc.Component {

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Sprite)
    drillSp: cc.Sprite = null;

    @property(cc.Node)
    showNodeList: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    init(id: number, data: T_Unlock) {
        this.nameLab.string = data.name;
        let strList = data.value.split("_");
        for (let i = 0; i < strList.length; i++) {
            let id = strList[i];
            let item = cc.instantiate(this.itemPrefab);
            item.getComponent(showBoxItem_min_Component).setData(id);
            this.showNodeList.addChild(item);
        }
        //左边的钻头
        //判断是否解锁
        let flag = false;
        let unlockList = GameManager.getInstance().getUnlockList();
        for (let i = 0; i < unlockList.length; i++) {
            let unlockId = unlockList[i];
            if (Number(unlockId) === id) {
                //已解锁
                flag = true;
            }
        }
        let path: string;
        if (flag) {
            path = "drill/drill_" + id;
        } else {
            path = "drill/drill_" + id + "_bg";
        }
        cc.loader.loadRes(path, cc.SpriteFrame, (err, spf: cc.SpriteFrame) => {
            if (!err) {
                this.drillSp.spriteFrame = spf;
            }
            // cc.log(err);
        })
    }

}
