import { mainContentItemState, mainContenItemData, saveName, NotifyEnum } from "../Interface";
import GameManager from "../GameManager";
import { T_Warehouse_Table } from "../Data/T_Warehouse";
import { T_Depth_Table } from "../Data/T_Depth";
import { T_OutLine_Table } from "../Data/T_OutLine";
import { _Notification_ } from "../_Notification_";
import Helloworld from "../Helloworld";

const { ccclass, property } = cc._decorator;

@ccclass
export default class mainContentItem_Component extends cc.Component {

    @property(cc.Node)
    mask: cc.Node = null;

    @property(cc.Sprite)
    topSp: cc.Sprite = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    valueLab: cc.Label = null;

    @property(cc.Label)
    moneyLab: cc.Label = null;

    @property(cc.SpriteFrame)
    warehouseSpf: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    depthSpf: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    outlineSpf: cc.SpriteFrame = null;

    _state: mainContentItemState = 0;
    _data: mainContenItemData = null;
    _gameManager: GameManager = null;

    onLoad() {
        //钱更新的时候监听
        // _Notification_.subscrib(NotifyEnum.UPDATEMONEY, this.updateMoney, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClickItem, this);
        //在判断是否到顶
        this.updateParentToBack();
    }

    updateMoney(obj: any, target: any) {
        let self = target as mainContentItem_Component;
        // self.init();
    }

    init(state: mainContentItemState, data: mainContenItemData) {
        this._gameManager = GameManager.getInstance();
        this._state = state;
        this._data = data;
        this.node.name = this._state + "";
        if (state == 1) {
            this.topSp.spriteFrame = this.warehouseSpf;
            this.nameLab.string = "仓库";
            this.valueLab.string = data.value + "";
        } else if (state == 2) {
            this.topSp.spriteFrame = this.depthSpf;
            this.nameLab.string = "深度";
            this.valueLab.string = data.value + "M";
        } else if (state == 3) {
            this.topSp.spriteFrame = this.outlineSpf;
            this.nameLab.string = "离线收益";
            this.valueLab.string = "+$" + data.value + "/min";
        }
        this.moneyLab.string = "$" + data.expend;
    }

    //封顶了
    updateParentToBack() {
        if (GameManager.getInstance().getWarehouseIsTop() && this._state === 1) {
            //更改父节点的位置
            let backParent = this.node.getParent().getParent().getChildByName("main_back");
            this.node.setParent(backParent);
        } else if (GameManager.getInstance().getDepthIsTop() && this._state === 2) {
            let backParent = this.node.getParent().getParent().getChildByName("main_back");
            this.node.setParent(backParent);
        } else if (GameManager.getInstance().getOutlineIsTop() && this._state === 3) {
            let backParent = this.node.getParent().getParent().getChildByName("main_back");
            this.node.setParent(backParent);
        }
    }

    updateParent() {
        let self = this;
        let userCount = Number(self._gameManager.getUserCount());
        if (self._state == 1) {
            let warehouse = Number(self._gameManager.getLevelWarehouse());
            if (warehouse >= 45) {
                //已到等级上限
                this.updateParentToBack();
            } else {
                let warehouseVo = T_Warehouse_Table.getVoByKey(warehouse + 1);
                self.changeParent((userCount > warehouseVo.expend));
            }

        } else if (self._state == 2) {
            let depth = Number(self._gameManager.getLevelDepth());
            if (depth >= 68) {
                //已到等级上限
                this.updateParentToBack();
            } else {
                let depthVo = T_Depth_Table.getVoByKey(depth + 1);
                self.changeParent((userCount > depthVo.expend));
            }

        } else if (self._state == 3) {
            let outline = Number(self._gameManager.getLevelOutline());
            if (outline >= 68) {
                this.updateParentToBack();
                //已到等级上限
            } else {
                let outlineVo = T_OutLine_Table.getVoByKey(outline + 1);
                self.changeParent((userCount > outlineVo.expend));
            }

        }
    }

    changeParent(isEnough: boolean) {
        let backParent = this.node.getParent().getParent().getChildByName("main_back");
        let frontParent = this.node.getParent().getParent().getChildByName("main_front");
        // let parent = this.node.getParent();

        if (this.node.getParent().name === "main_back") {
            if (isEnough) {
                // parent = frontParent;
                this.node.setParent(frontParent);
            }
        } else {
            if (!isEnough) {
                // parent = backParent;
                this.node.setParent(backParent);
            }
        }
    }

    onClickItem(evt: cc.Event.EventTouch) {
        //点击音效
        cc.Canvas.instance.node.getComponent(Helloworld).clickUpgradeAudio();
        //解锁
        let userCount = Number(this._gameManager.getUserCount());
        if (this._state == 1) {
            let warehouse = Number(this._gameManager.getLevelWarehouse());
            if (warehouse >= 45) {
                //已到等级上限
                this.updateParentToBack();
                return;
            }
            //当前要解锁的
            let warehouseVo = T_Warehouse_Table.getVoByKey(warehouse + 1);
            if (userCount < warehouseVo.expend) {
                //不理会
            } else {
                let currentCount = userCount - warehouseVo.expend;
                //保存钱数
                this._gameManager.saveData(saveName.USERCOUNT, currentCount);
                //保存等级
                this._gameManager.saveData(saveName.WAREHOUSE, warehouse + 1);
                //延迟
                warehouse += 1;
                if (warehouse >= 45) {
                    //已到等级上限
                    this.updateParentToBack();
                    return;
                }

                warehouseVo = T_Warehouse_Table.getVoByKey(warehouse + 1);
                //下一阶段要解锁的
                let obj: mainContenItemData = {
                    id: warehouseVo.id,
                    value: warehouseVo.count,
                    expend: warehouseVo.expend
                }
                this.init(this._state, obj);
            }
        } else if (this._state == 2) {
            let depth = Number(this._gameManager.getLevelDepth());

            if (depth >= 68) {
                //已到等级上限
                this.updateParentToBack();
                return;
            }
            let depthVo = T_Depth_Table.getVoByKey(depth + 1);
            if (userCount < depthVo.expend) {
                //不理会
            } else {
                //解锁
                let currentCount = userCount - depthVo.expend;
                //保存钱数
                this._gameManager.saveData(saveName.USERCOUNT, currentCount);
                //保存等级
                this._gameManager.saveData(saveName.DEPTH, depth + 1);
                //刷新一下
                depth += 1;
                if (depth >= 68) {
                    //已到等级上限
                    this.updateParentToBack();
                    return;
                }
                depthVo = T_Depth_Table.getVoByKey(depth + 1);
                //下一阶段要解锁的
                let obj: mainContenItemData = {
                    id: depthVo.id,
                    value: depthVo.depth,
                    expend: depthVo.expend
                }
                this.init(this._state, obj);
            }
        }
        else if (this._state == 3) {
            let outline = Number(this._gameManager.getLevelOutline());

            if (outline >= 68) {
                //已到等级上限
                //已到等级上限
                this.updateParentToBack();
                return;
            }
            let outlineVo = T_OutLine_Table.getVoByKey(outline + 1);
            if (userCount < outlineVo.expend) {
                //不理会
            } else {
                let currentCount = userCount - outlineVo.expend;
                //保存钱数
                this._gameManager.saveData(saveName.USERCOUNT, currentCount);
                //保存等级
                this._gameManager.saveData(saveName.OUTLINE, outline + 1);

                outline += 1;
                if (outline >= 68) {
                    //已到等级上限
                    this.updateParentToBack();
                    return;
                }
                outlineVo = T_OutLine_Table.getVoByKey(outline + 1);
                //下一阶段要解锁的
                let obj: mainContenItemData = {
                    id: outlineVo.id,
                    value: outlineVo.income,
                    expend: outlineVo.expend
                }
                this.init(this._state, obj);
            }
        }
        _Notification_.send(NotifyEnum.UPDATEMAINITEM);
    }
}
