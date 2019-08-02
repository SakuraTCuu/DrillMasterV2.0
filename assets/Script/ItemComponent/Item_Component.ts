import { _Notification_ } from "../_Notification_";
import { NotifyEnum, drillSpriteData, drillState } from "../Interface";
import { T_Unlock } from "../Data/T_unlock";
import GameUtil from "../Util/GameUtil";
import propItem_Component from "./propItem_Component";
import Helloworld from "../Helloworld";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Item_Component extends cc.Component {

    @property(cc.Animation)
    drill_topAnim: cc.Animation = null;

    @property(cc.Sprite)
    dirllSprite: cc.Sprite = null;

    @property(cc.Sprite)
    drill_mid_spf: cc.Sprite = null;

    @property(cc.Node)
    drill_down_back: cc.Node = null;

    @property(cc.Node)
    drill_down_front: cc.Node = null;

    _drillData: T_Unlock = null;
    _spriteData: drillSpriteData = null;
    nodeID: number = 0;
    _isSelected: boolean = false;

    drill_top: cc.Node = null;
    drillTopAnim: cc.Animation = null;
    drillAnim: cc.Animation = null;
    flame: cc.Animation = null;
    particle: cc.ParticleSystem = null;
    drill_down_back_left: cc.Sprite = null;
    drill_down_back_right: cc.Sprite = null;
    drill_down_front_left: cc.Sprite = null;
    drill_down_front_right: cc.Sprite = null;

    _currentState: drillState = drillState.normal;

    isScale1: boolean = false;
    onLoad() {
        // this.initView();
        this.node.on(cc.Node.EventType.TOUCH_END, this.clicked, this);
    }

    //当前钻头开始p跑
    startRun() {
        this._currentState = drillState.run;
        // this.drillAnim.stop();
        this.drillTopAnim.play();
    }

    startTopAnim() {
        this.drill_topAnim.node.active = true;
        this.drill_topAnim.play();
    }

    stopTopAnim() {
        this.drill_topAnim.node.active = false;
        this.drill_topAnim.pause();
    }

    startFlame() {
        this.flame.node.active = true;
        this.flame.play();
    }

    stopFlame() {
        this.flame.stop();
        this.flame.node.active = false;
    }

    setData(spiteData: drillSpriteData, drillData: T_Unlock, isSelected: boolean = false) {
        this._spriteData = spiteData;
        this._drillData = drillData;
        this._isSelected = isSelected;
        this.nodeID = drillData.id;
        this.node.name = this.nodeID + "";

        this.initView();
    }

    public initView() {
        this.drill_top = this.node.getChildByName("drill_top");
        this.drillAnim = this.node.getComponent(cc.Animation);
        this.particle = this.node.getChildByName("particle").getComponent(cc.ParticleSystem);

        this.flame = this.node.getChildByName("flame").getComponent(cc.Animation);

        this.drillTopAnim = this.drill_top.getComponent(cc.Animation);
        this.drill_down_back_left = this.drill_down_back.getChildByName("left").getComponent(cc.Sprite);
        this.drill_down_back_right = this.drill_down_back.getChildByName("right").getComponent(cc.Sprite);
        this.drill_down_front_left = this.drill_down_front.getChildByName("left").getComponent(cc.Sprite);
        this.drill_down_front_right = this.drill_down_front.getChildByName("right").getComponent(cc.Sprite);

        let id = this.nodeID;

        //判断当前是否解锁
        let flag = GameUtil.getIsUnlock(id);
        if (!flag) {
            this._currentState = drillState.normal;
            //隐藏动画UI
            this.setHideUI(false);
            //展示默认图片
            this.dirllSprite.node.active = true;
            // //更换皮肤;
            let all_path = "drill/drill_" + id;
            cc.loader.loadRes(all_path, cc.SpriteFrame, (err, sf: cc.SpriteFrame) => {
                if (!err) {
                    this.dirllSprite.spriteFrame = sf;
                }
                // cc.log("err-->>", err)
            })
            this.setColorUI();
        } else {
            this._currentState = drillState.unlock;
            this.setHideUI(true);
            this.dirllSprite.node.active = false;

            this.drillAnim.play();

            let path = "drill_turn_anim/drill_"
            let mid_path = path + id + "_mid";
            let back_path_left = path + id + "_back_0";
            let back_path_right = path + id + "_back_1";
            let front_path_left = path + id + "_front_0";
            let front_path_right = path + id + "_front_1";

            let sp = this._spriteData.sprite;

            if (sp.mid) {
                this.LoadRes(mid_path, (sf) => {
                    this.drill_mid_spf.spriteFrame = sf;
                })
            } else {
                this.drill_mid_spf.node.active = false;
            }

            if (sp.down_b) { //后
                if (sp.down_b.down_left) {
                    // 后 左
                    this.LoadRes(back_path_left, (sf) => {
                        this.drill_down_back_left.spriteFrame = sf;
                    })
                } else {
                    this.drill_down_back_left.node.active = false;
                }
                if (sp.down_b.down_right) {
                    //后右
                    this.LoadRes(back_path_right, (sf) => {
                        this.drill_down_back_right.spriteFrame = sf;
                    })
                } else {
                    this.drill_down_back_right.node.active = false;
                }
            } else {
                //隐藏
                this.drill_down_back.active = false;
            }
            if (sp.down_f) {
                if (sp.down_f.down_left) {
                    this.LoadRes(front_path_left, (sf) => {
                        this.drill_down_front_left.spriteFrame = sf;
                    })
                } else {
                    this.drill_down_front_left.node.active = false;
                } if (sp.down_f.down_right) {
                    this.LoadRes(front_path_right, (sf) => {
                        this.drill_down_front_right.spriteFrame = sf;
                    })
                } else {
                    this.drill_down_front_right.node.active = false;
                }
            } else {
                //隐藏
                this.drill_down_front.active = false;
            }
        }
        //开始做颜色的异化
        this.setSelected(this._isSelected);
    }

    public setHideUI(flag: boolean) {
        this.drill_top.active = flag;
        this.drill_mid_spf.node.active = flag;
        this.drill_down_back.active = flag;
        this.drill_down_front.active = flag;
    }

    public setColorUI() {
        this.dirllSprite.node.color = new cc.Color().fromHEX("#2E535E");
    }

    public setSelected(select: boolean, flag: boolean = false): void {
        this._isSelected = select;
        if (select) {
            this.node.scale = 0.8;
        } else {
            this.node.scale = 0.6;
        }
    }

    isCenter(pos: cc.Vec2) {
        let position = this.node.convertToWorldSpaceAR(this.node.position);
        let rect = new cc.Rect(position.x - this.node.width, position.y - this.node.height, this.node.width, this.node.height);
        return rect.contains(pos);
    }

    public getSelected(): boolean {
        return this._isSelected;
    }

    public clicked(evt: cc.Event.EventTouch) {
        if (this._currentState == drillState.unlock) {
            //开始游戏
            _Notification_.send(NotifyEnum.CLICK_DRILL_ITEM, this.nodeID);
        }
    }

    LoadRes(path, cb: Function) {
        cc.loader.loadRes(path, cc.SpriteFrame, (err, sf: cc.SpriteFrame) => {
            if (!err) {
                cb(sf);
            }
            // cc.log("err-->>", err)
        })
    }

    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter(other: cc.BoxCollider, self: cc.BoxCollider) {
        console.log('on collision enter');
        //收集 碰撞到的道具
        let itemId = other.getComponent(propItem_Component).id;
        let isGold = other.getComponent(propItem_Component).isGold;
        let obj = { id: itemId, isGold: isGold };

        //nodepool
        other.node.removeFromParent();
        cc.Canvas.instance.node.getComponent(Helloworld).nodePool.put(other.node);


        //跳钱动画

        //音效

        //发送消息
        //更新箱子进度
        _Notification_.send(NotifyEnum.GETITEMBYDRILL, obj);
    }
}
