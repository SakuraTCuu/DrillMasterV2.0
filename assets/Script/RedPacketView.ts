import { _Notification_ } from "./_Notification_";
import { NotifyEnum, saveName } from "./Interface";
import GameManager from "./GameManager";
import GameUtil from "./Util/GameUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RedPacketView extends cc.Component {

    @property(cc.Label)
    incomeLab: cc.Label = null;

    @property(cc.Node)
    collectBtn: cc.Node = null;

    @property(cc.Node)
    noThanksBtn: cc.Node = null;

    onLoad() {
        this.collectBtn.on(cc.Node.EventType.TOUCH_END, this.onClickCollect, this);
        this.noThanksBtn.on(cc.Node.EventType.TOUCH_END, this.onClickNoThanks, this);
    }

    onDestroy() {
        this.collectBtn.off(cc.Node.EventType.TOUCH_END, this.onClickCollect, this);
        this.noThanksBtn.off(cc.Node.EventType.TOUCH_END, this.onClickNoThanks, this);
    }

    _income: number = 0;

    _cb: Function = null;
    showView(callback: Function) {
        cc.log("showView");
        //随机展示一个金币
        this._cb = callback;
        this._income = GameUtil.calcRedPacket();
        this.incomeLab.string = "$" + this._income;
    }

    onClickCollect() {
        cc.log("RedPacketView-->>onClickCollect");
        //如果是第一次不需要看视频咯
        let money = Number(GameManager.getInstance().getTrueMoney());
        money += this._income;
        money = Number(money.toFixed(2));
        //保存然后调用
        GameManager.getInstance().saveData(saveName.TRUEMONEY, money);
        //观看次数+1;
        //观看了下把还弹出来
        GameManager.updateLookNum();
        this._cb && this._cb();
        if (GameManager.getInstance().getGameGuide() == 2) {
            cc.log("第一次不看视频哦");
        } else {
            //红包到账
            //观看视频
            GameManager.playAdVideo();
        }
        this.destroySelf();
    }

    onClickNoThanks() {
        cc.log("RedPacketView-->>onClickNoThanks");
        this._cb && this._cb();
        //拒绝了 接下来三把不弹出来
        GameManager.updateRefuseNum();
        this.destroySelf();
    }

    destroySelf() {
        this.node.active = false;
        this.node.removeFromParent();
        this.node.destroy();
    }
}
