import GameManager from "./GameManager";
import { T_OutLine_Table } from "./Data/T_OutLine";
import { saveName } from "./Interface";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ExChange extends cc.Component {

    @property(cc.Label)
    expendLab: cc.Label = null;

    @property(cc.Button)
    exchangeBtn: cc.Button = null;

    _expend: number = 0;

    ShowBtn() {
        let gm = GameManager.getInstance();
        let dollar = gm.getTrueMoney();
        if (dollar >= 1) {
            this.exchangeBtn.interactable = true;
        } else {
            this.exchangeBtn.interactable = false;
        }
    }


    /** 当金币不够时 可以用1美金来兑换金币 */
    showExChangeView() {
        this.ShowBtn();
        let gm = GameManager.getInstance();
        let depth = Number(gm.getLevelDepth());
        let outline = Number(gm.getLevelOutline());
        let warehouse = Number(gm.getLevelWarehouse());
        let outlineVo = T_OutLine_Table.getVoByKey(outline);
        let depthVo = T_OutLine_Table.getVoByKey(depth);
        let warehouseVo = T_OutLine_Table.getVoByKey(warehouse);

        let expend = outlineVo.expend;
        if (expend < depthVo.expend) {
            expend = depthVo.expend;
        }
        if (expend < warehouseVo.expend) {
            expend = warehouseVo.expend;
        }
        expend *= 1.8;
        expend = Math.ceil(expend / 1000);
        this._expend = expend;
        this.expendLab.string = expend + "K";
    }

    /** 点击按钮 */
    onClickExChangeBtn() {
        let gm = GameManager.getInstance();
        let dollar = gm.getTrueMoney();
        if (dollar >= 1) {
            let money = this._expend * 1000;
            let current = Number(gm.getUserCount());
            money += current;
            gm.saveData(saveName.USERCOUNT, money);
            dollar -= 1;
            gm.saveData(saveName.TRUEMONEY, dollar);
        } else {
             cc.log("美金不够.不予兑换");
        }
        this.node.active = false;
    }

    onClickClose() {
        this.node.active = false;
    }
}
