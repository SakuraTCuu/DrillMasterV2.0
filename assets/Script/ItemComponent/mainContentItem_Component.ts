import { mainContentItemState, mainContenItemData, saveName, NotifyEnum, STRING, noMoneyInterface } from "../Interface";
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
    _isGuide: boolean;

    onLoad() {
        //钱更新的时候监听
        // _Notification_.subscrib(NotifyEnum.UPDATEMONEY, this.updateMoney, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClickItem, this);
        //在判断是否到顶
        this.updateParentToBack();
    }

    init(state: mainContentItemState, data: mainContenItemData, isGuide: boolean = false) {
        this._gameManager = GameManager.getInstance();
        this._state = state;
        this._data = data;
        this._isGuide = isGuide;
        this.node.name = this._state + "";
        if (state == 1) {
            this.topSp.spriteFrame = this.warehouseSpf;
            this.nameLab.string = STRING.mainContentItemName1;
            this.valueLab.string = data.value + "";
        } else if (state == 2) {
            this.topSp.spriteFrame = this.depthSpf;
            this.nameLab.string = STRING.mainContentItemName2;
            this.valueLab.string = data.value + "M";
        } else if (state == 3) {
            this.topSp.spriteFrame = this.outlineSpf;
            this.nameLab.string = STRING.mainContentItemName3;
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
            if (warehouse >= T_Warehouse_Table.getAllVo().length) {
                //已到等级上限
                this.updateParentToBack();
            } else {
                let warehouseVo = T_Warehouse_Table.getVoByKey(warehouse);
                self.changeParent((userCount > warehouseVo.expend));
            }

        } else if (self._state == 2) {
            let depth = Number(self._gameManager.getLevelDepth());
            if (depth >= T_Depth_Table.getAllVo().length) {
                //已到等级上限
                this.updateParentToBack();
            } else {
                let depthVo = T_Depth_Table.getVoByKey(depth);
                self.changeParent((userCount > depthVo.expend));
            }

        } else if (self._state == 3) {
            let outline = Number(self._gameManager.getLevelOutline());
            if (outline >= T_OutLine_Table.getAllVo().length) {
                this.updateParentToBack();
                //已到等级上限
            } else {
                let outlineVo = T_OutLine_Table.getVoByKey(outline);
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
            if (warehouse >= T_Warehouse_Table.getAllVo().length) {
                //已到等级上限
                this.updateParentToBack();
                return;
            }
            //当前要解锁的
            let warehouseVo = T_Warehouse_Table.getVoByKey(warehouse);
            if (userCount < warehouseVo.expend) {
                //cc.log("钱不够", this._state);
                _Notification_.send(NotifyEnum.UPGRADENOMONEY);
                //不理会
            } else {
                let currentCount = userCount - warehouseVo.expend;
                //保存钱数
                this._gameManager.saveData(saveName.USERCOUNT, currentCount);
                //保存等级
                this._gameManager.saveData(saveName.WAREHOUSE, warehouse + 1);
                warehouse += 1;
                // warehouse = Number(this._gameManager.getLevelWarehouse());
                if (warehouse >= T_Warehouse_Table.getAllVo().length) {
                    //已到等级上限
                    this.updateParentToBack();
                    return;
                }
                warehouseVo = T_Warehouse_Table.getVoByKey(warehouse);
                //下一阶段要解锁的
                let obj: mainContenItemData = {
                    id: warehouseVo.id,
                    value: warehouseVo.count,
                    expend: warehouseVo.expend
                }
                if (!this._isGuide) {
                    //新手引导
                    //刷新下面的ui
                    this.init(this._state, obj);
                }
                _Notification_.send(NotifyEnum.UPGRADEITEMSUCCESS, this._state);
            }
        } else if (this._state == 2) {
            let depth = Number(this._gameManager.getLevelDepth());
            if (depth >= T_Depth_Table.getAllVo().length) {
                //已到等级上限
                this.updateParentToBack();
                return;
            }
            let depthVo = T_Depth_Table.getVoByKey(depth);
            if (userCount < depthVo.expend) {
                //cc.log("钱不够", this._state);
                _Notification_.send(NotifyEnum.UPGRADENOMONEY);
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
                if (depth >= T_Depth_Table.getAllVo().length) {
                    //已到等级上限
                    this.updateParentToBack();
                    return;
                }
                depthVo = T_Depth_Table.getVoByKey(depth);
                //下一阶段要解锁的
                let obj: mainContenItemData = {
                    id: depthVo.id,
                    value: depthVo.depth,
                    expend: depthVo.expend
                }
                if (!this._isGuide) {
                    //新手引导
                    //刷新下面的ui
                    this.init(this._state, obj);
                }
                _Notification_.send(NotifyEnum.UPGRADEITEMSUCCESS, this._state);
            }
        }
        else if (this._state == 3) {
            let outline = Number(this._gameManager.getLevelOutline());
            if (outline >= T_OutLine_Table.getAllVo().length) {
                //已到等级上限
                //已到等级上限
                this.updateParentToBack();
                return;
            }
            let outlineVo = T_OutLine_Table.getVoByKey(outline);
            if (userCount < outlineVo.expend) {
                //cc.log("钱不够", this._state);
                _Notification_.send(NotifyEnum.UPGRADENOMONEY);
                //不理会
            } else {
                let currentCount = userCount - outlineVo.expend;
                //保存钱数
                this._gameManager.saveData(saveName.USERCOUNT, currentCount);
                //保存等级
                this._gameManager.saveData(saveName.OUTLINE, outline + 1);

                outline += 1;
                if (outline >= T_OutLine_Table.getAllVo().length) {
                    //已到等级上限
                    this.updateParentToBack();
                    return;
                }
                outlineVo = T_OutLine_Table.getVoByKey(outline);
                //下一阶段要解锁的
                let obj: mainContenItemData = {
                    id: outlineVo.id,
                    value: outlineVo.income,
                    expend: outlineVo.expend
                }
                // this.init(this._state, obj, this._isGuide);
                if (!this._isGuide) {
                    //新手引导
                    //刷新下面的ui
                    this.init(this._state, obj);
                }
                _Notification_.send(NotifyEnum.UPGRADEITEMSUCCESS, this._state);
            }
        }
        _Notification_.send(NotifyEnum.UPDATEMAINITEM, this._state);
        if (this._isGuide) {
            //发消息隐藏引导
            _Notification_.send(NotifyEnum.HIDEGAMEGUIDE, this._state);
            //销毁自身
            this.node.destroy();
        }
    }
}
