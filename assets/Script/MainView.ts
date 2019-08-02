import { NotifyEnum, drillSpriteData } from "./Interface";
import { _Notification_ } from "./_Notification_";
import { T_Item, T_Item_Table } from "./Data/T_Item";
import { T_Unlock_Table, T_Unlock } from "./Data/T_unlock";
import GameManager from "./GameManager";
import Item_Component from "./ItemComponent/Item_Component";
import showContentItem_Component from "./ItemComponent/showContentItem_Component";
import GameUtil from "./Util/GameUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainView extends cc.Component {

    @property(cc.Node)
    showNode: cc.Node = null;

    @property(cc.JsonAsset)
    mDrillData: cc.JsonAsset = null;

    @property(cc.Prefab)
    mainItem: cc.Prefab = null;

    @property(cc.Prefab)
    contentItem: cc.Prefab = null;


    //item宽高
    private _itemWidth: number;
    //item之间的间隔
    private _interval: number;

    _dataList: Array<cc.Node> = null;;

    _startPoint: cc.Vec2 = null;
    _endPoint: cc.Vec2 = null;
    _movePrePos: cc.Vec2 = null;
    _centerPoint: cc.Vec2 = null;
    _currentId: number = 2;

    _touchStatus: boolean = false;

    //===========================
    _showList: cc.Node = null;
    _start: cc.Node = null;
    _contentData: any;

    //===================
    _GameManager: GameManager = null;

    drillList: T_Unlock[] = null;
    data: Array<drillSpriteData> = null;

    onLoad() {
        this._GameManager = GameManager.getInstance();
        _Notification_.subscrib(NotifyEnum.CLICK_DRILL_ITEM, this.clickItem, this);

        this._showList = this.showNode.getChildByName('showList');
        this._start = this.showNode.getChildByName('start');
        //初始化页面

        //json 配表  里面包含图片的id
        this.data = this.mDrillData.json;
        //数据配表, 里面包含钻头的数据
        this.drillList = T_Unlock_Table.getAllVo();

        this._dataList = new Array<cc.Node>();
        //设置数据
        for (let i = 0; i < this.drillList.length; i++) {
            let mainItem = cc.instantiate(this.mainItem);
            let drillClass = mainItem.getComponent(Item_Component);
            drillClass.setData(this.data[i], this.drillList[i]);
            this._dataList.push(mainItem);
        }
        this.init(140, 20);
        this.showView();
        this.registerEvent();
    }

    /**
    * 初始化滚动视图
    */
    public init(itemWidth: number, interval: number): void {
        this._itemWidth = itemWidth;
        this._interval = interval;
        this.calcCenterPoint();
        this._currentId = 2;
    }

    public calcCenterPoint() {
        this._centerPoint = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
    }

    registerEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
    }

    //克隆一个钻头节点, 并把它当做主钻头
    //克隆预制体吧 , 克隆节点的话 因为是浅拷贝,会导致属性变化,尽量避免
    getItemNode(): cc.Node {
        // cc.instantiate(this._dataList[this._currentId]);
        let i = this._currentId;
        let mainItem = cc.instantiate(this.mainItem);
        let drillClass = mainItem.getComponent(Item_Component);
        drillClass.setData(this.data[i], this.drillList[i], true);
        return mainItem;
    }
    /**
    * 显示
    */
    private showView(): void {
        let initX = -this.node.width / 2;
        let initY = 0;
        for (let i = 0; i < this._dataList.length; i++) {
            let item = this._dataList[i];
            this.node.addChild(item);
            item.x = initX;
            item.y = initY;
            initX = initX + this._itemWidth + this._interval;
        }
        // cc.log(this._dataList[2].x);//-320
        this.preItem(2, false);

        this.scheduleOnce(() => {
            this.midScale();
        }, 0.15);
    }

    _preTime: number = 0;
    touchStart(event: cc.Event.EventTouch) {
        let currentTime = Date.now();
        if (currentTime - this._preTime < 200) {
            this._touchStatus = false;
            this._preTime = currentTime;
            return;
        }
        this._touchStatus = true;
        this._preTime = currentTime;
        this._startPoint = event.getLocation();
        this._movePrePos = this._startPoint;
    }

    touchEnd(event: cc.Event.EventTouch) {
        if (!this._touchStatus) { return; }
        this._endPoint = event.getLocation();
        let dis = this._startPoint.x - this._endPoint.x;
        if (Math.abs(dis) > 50) {
            if (dis < 0) {
                if (this.isCanPreMove()) {
                    this.preItem();
                } else {
                    cc.log("premove");
                }
            } else {
                if (this.isCanNextMove()) {
                    this.nextItem();
                } else {
                    cc.log("canNextMove");
                }
            }
        }
    }

    isCanPreMove(): boolean {
        // cc.log("preMove x -->>", this._dataList[0].x);
        if (this._dataList[0].x >= 0) {
            return false;
        }
        return true;
    }

    isCanNextMove(): boolean {
        // cc.log("nextMove x -->>", this._dataList[this._dataList.length - 1].x);
        if (this._dataList[this._dataList.length - 1].x <= 0) {
            return false;
        }
        return true;
    }

    private preItem(per: number = 1, isTween: boolean = true) {
        this._currentId -= per;
        if (this._currentId < 0) {
            this._currentId = 0;
            return;
        }
        let self = this;
        let dist = per * (this._itemWidth + this._interval);
        for (let i = 0; i < this._dataList.length; i++) {
            (function (_item, _dist: number, _isTween: boolean, id: number): void {
                let toX = _item.x + _dist;
                self.showContent();
                if (_isTween) {
                    let moveAct = cc.moveTo(0.15, toX, _item.y);
                    if (self._currentId == id) {
                        //即将要放大
                        let scaleAct = cc.scaleTo(0.15, 0.8).easing(cc.easeOut(3.0));
                        let spaAct = cc.spawn(moveAct, scaleAct);
                        _item.runAction(spaAct);
                    } else if (self._currentId == (id - 1)) {
                        let scaleAct = cc.scaleTo(0.15, 0.6).easing(cc.easeOut(3.0));
                        let spaAct = cc.spawn(moveAct, scaleAct);
                        _item.runAction(spaAct);
                    } else {
                        _item.runAction(moveAct);
                    }
                } else {
                    _item.x = toX;
                }
            })(this._dataList[i], dist, isTween, i);
        }
    }

    private nextItem(per: number = 1, isTween: boolean = true) {
        this._currentId += per;
        if (this._currentId > 10) {
            this._currentId = 10;
            return;
        }
        let self = this;
        let dist = per * (this._itemWidth + this._interval);
        for (let i = 0; i < this._dataList.length; i++) {
            (function (_item, _dist: number, _isTween: boolean, id: number): void {
                let toX = _item.x - _dist;
                self.showContent();
                if (_isTween) {
                    let moveAct = cc.moveTo(0.15, toX, _item.y);
                    if (self._currentId == id) {
                        //即将要放大
                        let scaleAct = cc.scaleTo(0.15, 0.8).easing(cc.easeOut(3.0));
                        let spaAct = cc.spawn(moveAct, scaleAct);
                        _item.runAction(spaAct);
                    } else if (self._currentId == (id + 1)) {
                        let scaleAct = cc.scaleTo(0.15, 0.6).easing(cc.easeOut(3.0));
                        let spaAct = cc.spawn(moveAct, scaleAct);
                        _item.runAction(spaAct);
                    } else {
                        _item.runAction(moveAct);
                    }
                } else {
                    _item.x = toX;
                }
            })(this._dataList[i], dist, isTween, i);
        }
    }

    //中间的永远放大 
    private midScale() {
        for (let i = 0; i < this._dataList.length; i++) {
            let item = this._dataList[i];
            if (this._currentId == i) {
                item.getComponent(Item_Component).setSelected(true);
                this.showContent();
            } else {
                item.getComponent(Item_Component).setSelected(false);
            }
        }
    }

    //点击 item  是否开始游戏
    clickItem(obj: any, target: any) {
        let self = target;
        let id = Number(obj);
        //判断是否解锁
        let flag = GameUtil.getIsUnlock(self._currentId);
        //解锁且在中间
        if (self._currentId == id && flag) {
            _Notification_.send(NotifyEnum.CLICK_START, id);
        } else {
            cc.log('当前未解锁');
        }
    }

    private showContent() {
        // cc.log("currentId-->>", this._currentId)
        if (this._currentId == 0) {  //默认的不需要展示,直接开始游戏
            this._start.active = true;
            this._showList.active = false;
            return;
        }

        //首先判断是否已经解锁
        //解锁的就展示开始游戏
        //未解锁的就展示四个格子
        let flag = GameUtil.getIsUnlock(this._currentId);

        //已经解锁
        if (flag) {
            this._start.active = true;
            this._showList.active = false;
        } else {
            this._start.active = false;
            this._showList.active = true;
            //初始化四个格子
            let unlockVo = T_Unlock_Table.getVoByKey(this._currentId);
            this.showContentList(unlockVo.value);
        }
    }

    //展示四个格子的道具
    showContentList(str: string) {
        this._showList.removeAllChildren();
        let strList = str.split('_');
        //判断是否解锁
        let unLockItemList = this._GameManager.getItemList();
        for (let j = 0; j < strList.length; j++) {
            let flag = false;
            for (let i = 0; i < unLockItemList.length; i++) {
                if (unLockItemList[i] === strList[j]) {
                    flag = true;
                }
            }

            if (flag) {
                //已经拥有的道具
                let item = cc.instantiate(this.contentItem);
                item.getComponent(showContentItem_Component).initSprite(strList[j] + "_1", 0);
                this._showList.addChild(item);
            } else {
                //未曾拥有的道具
                let item = cc.instantiate(this.contentItem);
                item.getComponent(showContentItem_Component).initSprite(strList[j] + "_0", 1);
                this._showList.addChild(item);
            }
        }
    }

    //return the data list.
    public getVos(): Array<cc.Node> {
        return this._dataList;
    }

    //滑动到指定页
    //废弃
    public gotoPage(idx: number): void {
        if (idx <= this.getVos().length && idx > 2) {
            for (let i = 2; i < idx; i++) {
                this.preItem(1, false);
            }
        } else if (idx < 2 && idx >= 1) {
            this.nextItem(1, false);
        }
    }

    //销毁函数
    public onDestroy(): void {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        // this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
    }

    //=======================TOOL Method=============================


}
