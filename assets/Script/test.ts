import { T_Depth } from "./Data/T_Depth";
import GameManager from "./GameManager";
import { saveName } from "./Interface";

const { ccclass, property } = cc._decorator;

@ccclass
export default class test extends cc.Component {

    @property(cc.Node)
    drill: cc.Node = null;

    _movePos: cc.Vec2 = null;

    // onLoad() {
    //     // GameManager.getInstance().saveData(saveName.UNLOCK, 10 + "");
    //     // for (let i = 1; i <= 61; i++) {
    //     //     GameManager.getInstance().saveData(saveName.USERITEM, i + "");
    //     // }
    // }

    onLoad() {
        let str = "";
        let expend;
        for (let i = 61; i <= 120; i++) {
            let id = i;
            if (i == 61) {
                expend = 182708525;
            } else {
                expend = Math.round(expend * 1.25);
            }
            let depth = 140 + (i - 1) * 10;
            let desc = "深度:" + depth + ",升级消耗:" + expend + "$";
            let level = id;
            let depthVo = {
                id: id,
                desc: desc,
                level: level,
                depth: depth,
                expend: expend
            }
            str += JSON.stringify(depthVo);
            str += ","
        }
        cc.log(str);
    }

    start() {
        // this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        // this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        // this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    touchStart(evt) {
        this._movePos = evt.getLocation();
    }

    onTouchMove(evt) {
        let pos = evt.getLocation();

        let subVect = pos.sub(this._movePos);
        let radian = Math.atan2(subVect.x, subVect.y);
        let degrees = cc.misc.radiansToDegrees(radian);
        cc.log("degress-->>", degrees);
        if (degrees > 90) {
            degrees = 90;
        }
        if (degrees < -90) {
            degrees = - 90;
        }
        this.drill.rotation = degrees;

        // this._movePos = pos;

    }

    onTouchEnd(evt) {
        // let pos = evt.getLocation();

        // let playerWorldPos = this.drill.getParent().convertToWorldSpaceAR(this.drill.position);

        // let subVect = pos.sub(playerWorldPos);
        // let radian = Math.atan2(subVect.x, subVect.y);
        // let degrees = cc.misc.radiansToDegrees(radian);
        // cc.log("degress-->>", degrees);
        // this.drill.rotation = degrees;
    }
}
