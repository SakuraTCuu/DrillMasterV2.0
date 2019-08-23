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

    showView() {
        cc.log("showView");
        //随机展示一个金币
        this._income = GameUtil.calcRedPacket();
        this.incomeLab.string = "$" + this._income;

        //展示btn动画
        this.showCollectAnim();
    }

    onClickCollect() {
        cc.log("RedPacketView-->>onClickCollect");
        //播放完广告在发放奖励
        //观看次数+1;
        //观看了下把还弹出来
        GameManager.updateLookNum();
        if (GameManager.getInstance().getGameGuide() == 2) {
            cc.log("第一次不看视频哦");
        } else {
            //红包到账
            //观看视频
            GameManager.money = this._income;
            GameManager.playAdVideo(2);
            // this.destroySelf();
            return;
        }
        //如果是第一次不需要看视频咯
        let money = GameManager.getInstance().getTrueMoney();
        money += this._income;
        money = Number(money.toFixed(2));
        //保存然后调用
        GameManager.getInstance().saveData(saveName.TRUEMONEY, money);
        this.destroySelf();
    }

    onClickNoThanks() {
        cc.log("RedPacketView-->>onClickNoThanks");
        //拒绝了 接下来三把不弹出来
        GameManager.updateRefuseNum();
        this.destroySelf();
    }

    destroySelf() {
        this.node.active = false;
        // this.node.removeFromParent();
        // this.node.destroy();
    }

    //先展示双倍按钮,在展示获取按钮
    showCollectAnim() {
        this.collectBtn.active = true;
        this.noThanksBtn.active = false;

        let scaleAct1 = cc.scaleTo(0.5, 1.2);
        let scaleAct2 = cc.scaleTo(0.5, 0.8);
        let scaleAct3 = cc.scaleTo(0.5, 1.1);
        let scaleAct4 = cc.scaleTo(0.5, 1.0);
        // let seqAct = cc.sequence(scaleAct1, scaleAct2, scaleAct3, scaleAct4, cc.callFunc(() => {
        //     this.noThanksBtn.active = true;
        // }));
        let repetAct = cc.repeatForever(cc.sequence(scaleAct1, scaleAct2, scaleAct3, scaleAct4))
        this.collectBtn.runAction(repetAct);

        this.scheduleOnce(() => {
            this.noThanksBtn.active = true;
        }, 2)
    }
}
