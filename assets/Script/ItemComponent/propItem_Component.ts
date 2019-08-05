import Helloworld from "../Helloworld";
import labItem_Component from "./labItem_Component";
import GameManager from "../GameManager";
import { T_Item_Table } from "../Data/T_Item";

const { ccclass, property } = cc._decorator;

@ccclass
export default class propItem_Component extends cc.Component {

    @property(cc.Sprite)
    normalSp: cc.Sprite = null;

    @property(cc.MotionStreak)
    mk: cc.MotionStreak = null;

    id: number = 0;
    isGold: boolean = false;

    init(id: number, isGold: boolean) {
        // cc.log("id-->>", id);
        let spriteAtlas = cc.Canvas.instance.node.getComponent(Helloworld).itemSpriteAtlas;
        this.id = id;
        this.isGold = isGold;
        let path = id + "";
        if (isGold) {
            path += "_2";
        } else {
            path += "_1";
        }
        let sp = spriteAtlas.getSpriteFrame(path);
        this.normalSp.spriteFrame = sp;
        // cc.loader.loadRes(path, cc.SpriteFrame, (err, spf: cc.SpriteFrame) => {
        //     if (!err) {
        //         this.normalSp.spriteFrame = spf;
        //     }
        //     // cc.log('err-->>', err);
        // })
    }

    //展示拖尾 动画
    showMK() {
        this.mk.enabled = true;
    }

    hideMK() {
        this.mk.enabled = false;
    }

    /**
 * 当碰撞产生的时候调用
 * @param  {Collider} other 产生碰撞的另一个碰撞组件
 * @param  {Collider} self  产生碰撞的自身的碰撞组件
 */
    onCollisionEnter(other: cc.BoxCollider, self: cc.BoxCollider) {
        // console.log('on collision enter');
        // self.node.destroy();
        //展示金钱动画
        let hw = cc.Canvas.instance.node.getComponent(Helloworld)
        //跳钱动画
        let labItem = hw.labItemPool.get();
        if (!labItem) {
            labItem = cc.instantiate(hw.labItem);
        }
        let itemVo = T_Item_Table.getVoByKey(this.id);
        labItem.getComponent(labItem_Component).init(this.isGold, itemVo.value, true);
        hw.propItemLabContetn.zIndex = cc.macro.MAX_ZINDEX;
        hw.propItemLabContetn.addChild(labItem);
        // labItem.position = this.node.position;
        let pos = hw.gameItemContent.convertToWorldSpaceAR(other.node.position);
        let newPos = hw.propItemLabContetn.convertToNodeSpaceAR(pos);
        labItem.position = newPos;
        // 播放音效
        if (this.isGold) {
            cc.Canvas.instance.node.getComponent(Helloworld).playItemGoldAudio();
        } else {
            cc.Canvas.instance.node.getComponent(Helloworld).playItemNormalAudio();
        }
    }
}
