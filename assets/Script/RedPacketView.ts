import { _Notification_ } from "./_Notification_";
import { NotifyEnum, saveName } from "./Interface";
import GameManager from "./GameManager";
import GameUtil from "./Util/GameUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RedPacketView extends cc.Component {

    @property(cc.Label)
    incomeLab: cc.Label = null;

    _income: number = 0;

    _cb: Function = null;
    showView(callback: Function) {
        //随机展示一个金币
        this._cb = callback;

        this._income = GameUtil.calcRedPacket();
        this.incomeLab.string = "$" + this._income;
    }

    onClickCollect() {
        //需要看视频咯.....
        this.node.active = false;
        this._cb && this._cb();
        // _Notification_.send(NotifyEnum.CLICKREDPACKETCOLLECT, this._income);
        let money = Number(GameManager.getInstance().getTrueMoney());
        money += this._income;
        money = Number(money.toFixed(2));
        //保存然后调用
        GameManager.getInstance().saveData(saveName.TRUEMONEY, money);
        //红包到账
        //观看视频
        GameManager.playAdVideo();
        //观看次数+1;
        //观看了下把还弹出来
        GameManager.updateLookNum();
    }

    onClickNoThanks() {
        this._cb && this._cb();
        this.node.active = false;
        //拒绝了 接下来三把不弹出来
        GameManager.updateRefuseNum();
    }
}
