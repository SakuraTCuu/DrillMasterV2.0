import { moveState, NotifyEnum, mainContenItemData, collectItemData, saveName, mainContentItemState } from "./Interface";
import { _Notification_ } from "./_Notification_";
import GameManager from "./GameManager";
import { T_OutLine_Table, T_OutLine } from "./Data/T_OutLine";
import MainView from "./MainView";
import Item_Component from "./ItemComponent/Item_Component";
import mainContentItem_Component from "./ItemComponent/mainContentItem_Component";
import { T_Depth, T_Depth_Table } from "./Data/T_Depth";
import { T_Warehouse_Table, T_Warehouse } from "./Data/T_Warehouse";
import OfflineView from "./OfflineView";
import propItem_Component from "./ItemComponent/propItem_Component";
import { T_Unlock_Table } from "./Data/T_unlock";
import { T_Item_Table, T_Item } from "./Data/T_Item";
import labItem_Component from "./ItemComponent/labItem_Component";
import GameUtil from "./Util/GameUtil";
import BaoxiangView from "./BaoxiangView";

const { ccclass, property } = cc._decorator;


@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Node)
    mCanvas: cc.Node = null;

    @property(cc.Node)
    cloud: cc.Node = null;

    @property(cc.Node)
    mainNode: cc.Node = null;

    @property(cc.Node)
    setting: cc.Node = null;

    @property(cc.Prefab)
    propItem: cc.Prefab = null;

    @property(cc.Prefab)
    mainDownItem: cc.Prefab = null;

    @property(cc.Prefab)
    labItem: cc.Prefab = null;

    @property(cc.Label)
    moneyLab: cc.Label = null;

    @property(cc.Node)
    showBoxUI: cc.Node = null;

    @property(cc.Node)
    settingUI: cc.Node = null;

    @property(cc.Node)
    offLineUI: cc.Node = null;

    @property(cc.Node)
    HUDUi: cc.Node = null;

    @property(cc.Node)
    gameItemContent: cc.Node = null;

    @property(cc.Node)
    popItemContent: cc.Node = null;

    @property(cc.Node)  //碰撞到的展示
    propItemLabContetn: cc.Node = null;

    @property(cc.Camera)
    camera: cc.Camera = null;

    @property(cc.Node)
    showItemContent: cc.Node = null;

    @property(cc.Node)  //结果展示
    showLabItemContent: cc.Node = null;

    @property(cc.SpriteAtlas)  //图集
    itemSpriteAtlas: cc.SpriteAtlas = null;

    @property(cc.Node)  //新手引导手
    guideHand: cc.Node = null;

    @property(cc.Node)  //新手引导
    guideContent: cc.Node = null;

    @property(cc.Node)  //新手引导 宝箱
    baoXiangContent: cc.Node = null;

    @property(cc.Node)  //宝箱详情界面
    baoXiangView: cc.Node = null;

    @property(cc.Node)  //宝箱按钮
    baoxiangBtn: cc.Node = null;

    @property({
        type: cc.AudioClip
    })
    hallAudio: cc.AudioClip = null;

    @property({
        type: cc.AudioClip
    })
    clickAudip: cc.AudioClip = null;

    @property({
        type: cc.AudioClip
    })
    closeAudio: cc.AudioClip = null;

    @property({
        type: cc.AudioClip
    })
    upgradeAudio: cc.AudioClip = null;

    @property({
        type: cc.AudioClip
    })
    startAudio: cc.AudioClip = null;

    @property({
        type: cc.AudioClip
    })
    wheelAudio: cc.AudioClip = null;

    @property({
        type: cc.AudioClip
    })
    loopAudio: cc.AudioClip = null;

    @property({
        type: cc.AudioClip
    })
    rocketLoopAudio: cc.AudioClip = null;

    @property({
        type: cc.AudioClip
    })
    topAudio: cc.AudioClip = null;

    @property({
        type: cc.AudioClip
    })
    itemGoldAudio: cc.AudioClip = null;

    @property({
        type: cc.AudioClip
    })
    itemNormalAudio: cc.AudioClip = null;

    @property({
        type: cc.AudioClip
    })
    collectMoneyAudio: cc.AudioClip = null;

    //下降速度
    @property(Number)
    downSpeed: number = 350;

    //上升速度
    @property(Number)
    upSpeed: number = 350;

    //每个格子的数量
    @property(Number)
    gridNumebrItem: number = 350;

    //系数  每升一级增加的距离
    @property(Number)
    perLevelDis: number = 120;

    //到一定高度 停止
    @property(Number)
    targetDepth: number = 752;

    //钻头
    drill: cc.Node = null;
    drillClass: Item_Component = null;
    _mainView: cc.Node = null;
    _mainDrill: cc.Node = null;
    // _mainDownView: cc.Node = null;
    _mainDownBackView: cc.Node = null;
    _mainDownFrontView: cc.Node = null;

    _preMovePos: cc.Vec2 = null;
    _preDegress: number = 0;
    _currentState: moveState = moveState.normal;

    _gameManager: GameManager = null;

    //道具节点池
    nodePool: cc.NodePool = null;
    // lab item 节点池
    labItemPool: cc.NodePool = null;

    //收集到的道具数量
    _itemNumber: number = 0;
    _levelDpeth: number = 0;
    _levelWarehouse: number = 0;
    _collectList: Array<collectItemData> = new Array();
    collectNodeList: Array<cc.Node> = new Array();
    constNum: number = 3860;
    _currentDepth: number = 0;

    _isTouch: boolean = false;

    onLoad() {
        //开启碰撞
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        this._gameManager = GameManager.getInstance();
        this.initData();
        this.initView();
        this.initGame();
        this.initAudio();
        this.initGameGudie();
        _Notification_.subscrib(NotifyEnum.CLICK_START, this.onClickStart, this);
        _Notification_.subscrib(NotifyEnum.UPDATEMONEY, this.updateMoneyLab, this);
        _Notification_.subscrib(NotifyEnum.UPDATEDEPTH, this.updateDepth, this);
        _Notification_.subscrib(NotifyEnum.UPDATEMAINITEM, this.updateMainUI, this);
        _Notification_.subscrib(NotifyEnum.GETITEMBYDRILL, this.getItemByDrill, this);
        _Notification_.subscrib(NotifyEnum.CLICKCOLLECT, this.clickCollect, this);
        _Notification_.subscrib(NotifyEnum.HIDEGAMEGUIDE, this.hideGameGuide, this);
    }

    start() {
        //初始化节点池
        this.nodePool = new cc.NodePool();
        this.labItemPool = new cc.NodePool();
        let itemList = T_Item_Table.getAllVo();
        //生成多少个?
        //应该有当前深度来计算
        // let count = Math.ceil((this._currentDepth - this.constNum) / 2 / 752);
        let count = Math.ceil(this._levelDpeth / 4) + 1;
        let len = count * this.gridNumebrItem;
        if (len > 40) {
            len = 40;
        }
        cc.log("共需生成", len);
        let i = 0;
        this.schedule(() => {
            let item = cc.instantiate(this.propItem);
            // let isGold = Math.random() * 10 <= 2;
            // item.getComponent(propItem_Component).init(itemList[i].id, isGold);
            this.nodePool.put(item);
            if (i === len - 1) {
                cc.log("节点池初始化完毕");
            }
            // cc.log("生成item-->>", i);
            i++;
        }, 0.017, len - 1, 0);

        //生成 itemLab
        let time = len * 0.017;
        this.schedule(() => {
            let item = cc.instantiate(this.labItem);
            this.labItemPool.put(item);
        }, 0.017, 20, time);
    }

    onDestroy() {
        _Notification_.unsubscrib(NotifyEnum.CLICK_START, this.onClickStart);
        _Notification_.unsubscrib(NotifyEnum.UPDATEMONEY, this.updateMoneyLab);
    }

    initData() {
        let self = this;
        //获取当前下潜深度
        self._levelDpeth = Number(self._gameManager.getLevelDepth());

        self._levelWarehouse = Number(self._gameManager.getLevelWarehouse());
        //需要生成item占用 格子的数量
        // let gridNumber = (levelDpeth * self.perLevelDis) / 752;
        // self._currentDepth = gridNumber * 2 * 752;
        self._currentDepth = self.constNum + self._levelDpeth * self.perLevelDis;

        cc.log("当前深度-->>", self._currentDepth);
    }

    initView() {
        this._mainView = this.mainNode.getChildByName("mainView");
        this._mainDrill = this.mCanvas.getChildByName("drill_main");
        this._mainDownBackView = this.mainNode.getChildByName("main_back");
        this._mainDownFrontView = this.mainNode.getChildByName("main_front");

        if (!this._gameManager.getIsChannel()) {
            this.baoxiangBtn.active = false;
        } else {
            this.baoxiangBtn.active = true;
        }
        this.initMainUI();
        this.initMoneyLab();
    }

    initMainUI() {
        let userCount = Number(this._gameManager.getUserCount());
        //获取数据
        let warehouse = this._gameManager.getLevelWarehouse();
        let depth = this._gameManager.getLevelDepth();
        let outline = this._gameManager.getLevelOutline();

        let warehouseVo: T_Warehouse;
        let depthVo: T_Depth;
        let outlineVo: T_OutLine;
        if (this._gameManager.getWarehouseIsTop()) {
            //已达到最高
            warehouseVo = T_Warehouse_Table.getVoByKey(Number(warehouse));
        } else {
            warehouseVo = T_Warehouse_Table.getVoByKey(Number(warehouse));
        }

        if (this._gameManager.getDepthIsTop()) {
            depthVo = T_Depth_Table.getVoByKey(Number(depth));
        } else {
            depthVo = T_Depth_Table.getVoByKey(Number(depth));
        }

        if (this._gameManager.getOutlineIsTop()) {
            outlineVo = T_OutLine_Table.getVoByKey(Number(outline));
        } else {
            outlineVo = T_OutLine_Table.getVoByKey(Number(outline));
        }
        //下一段要解锁的

        // 包装数据
        let obj: Array<mainContenItemData> = [{
            id: 1,
            value: warehouseVo.count,
            expend: warehouseVo.expend
        }, {
            id: 2,
            value: depthVo.depth,
            expend: depthVo.expend
        }, {
            id: 3,
            value: outlineVo.income,
            expend: outlineVo.expend
        }];

        //初始化动画
        //初始化界面ui
        for (let i = 1; i <= 3; i++) {
            let item = cc.instantiate(this.mainDownItem);
            item.getComponent(mainContentItem_Component).init(i, obj[i - 1]);
            if (i == 1) {
                item.position = cc.v2(- 320 + (i * (640 / 3 / 2)), 0);
            } else if (i == 2) {
                item.position = cc.v2(- 320 + ((i + 1) * (640 / 3 / 2)), 0);
            } else if (i == 3) {
                item.position = cc.v2(- 320 + ((i + 2) * (640 / 3 / 2)), 0);
            }

            if (obj[i - 1].expend > userCount) {
                //钱不够
                this._mainDownBackView.addChild(item);
            } else {
                this._mainDownFrontView.addChild(item);
            }
        }
    }

    updateMainUI(obj: any, target: any) {
        let self = target as Helloworld;
        for (let i = 0; i < self._mainDownBackView.childrenCount; i++) {
            let item = self._mainDownBackView.children[i];
            item.getComponent(mainContentItem_Component).updateParent();
        }

        for (let i = 0; i < self._mainDownFrontView.childrenCount; i++) {
            let item = self._mainDownFrontView.children[i];
            item.getComponent(mainContentItem_Component).updateParent();
        }
    }

    initMoneyLab() {
        let self = this;
        self.moneyLab.string = "$" + self._gameManager.getUserCount();
    }

    updateMoneyLab(obj: any, target: any) {
        let self = target as Helloworld;
        //初始化界面钱数
        self.moneyLab.string = "$" + self._gameManager.getUserCount();
        self.initData();
        self.updateMainUI("", self);
    }

    updateDepth(obj: any, target: any) {
        let self = target as Helloworld;
        //更新深度
        self.initData();
    }

    clickCollect(obj: any, target: any) {
        // cc.log("??????");
        let self = target as Helloworld;
        if (obj && Number(obj) === 1) {
            // self.hidePopItemAnimView();
        }

        //收集完看看是否有宝箱道具
        //弹出宝箱特效
        this.popBaoxiangView();
    }

    // 弹出宝箱特效
    popBaoxiangView() {

    }
    /**
     * 首先检查离线收益 弹出对话框
     * 初始化全局的道具和钻头
     */
    initGame() {
        let income = this._gameManager.getOfflineIncome();
        if (income > 0) {
            this.offLineUI.active = true;
        } else {
            this.offLineUI.active = false;
        }
        this.offLineUI.getComponent(OfflineView).showOffline();
        //Android 退出监听
        GameManager.addExitEvent();
    }

    //初始化音效
    initAudio() {
        GameManager.audioManger.playBGM(this.hallAudio);
    }

    //初始化新手引导
    initGameGudie() {
        let id = this._gameManager.getGameGuide();
        if (id === 0) {
            return;
        }
        this.showGameGuide(id + 1);
    }

    hideGameGuide(obj: any, target: any) {
        cc.log("hideGameGuide-->>");
        let self = target as Helloworld;
        let id = Number(obj);
        let itemNode = self.guideContent.getChildByName("mainItem");
        if (id == 1) {
            //刷新1 的ui
            let targetNode = self._mainDownBackView.getChildByName("1");
            if (!targetNode) {
                targetNode = self._mainDownFrontView.getChildByName("1");
            }
            let warehouse = self._gameManager.getLevelWarehouse();
            let warehouseVo = T_Warehouse_Table.getVoByKey(Number(warehouse));
            let data: mainContenItemData =
            {
                id: 1,
                value: warehouseVo.count,
                expend: warehouseVo.expend
            };
            targetNode.getComponent(mainContentItem_Component).init(1, data, false);
        } else if (id == 2) {
            //刷新2 的ui
            let targetNode = self._mainDownBackView.getChildByName("2");
            if (!targetNode) {
                targetNode = self._mainDownFrontView.getChildByName("2");
            }
            let levelDepth = self._gameManager.getLevelDepth();
            let depthVo = T_Depth_Table.getVoByKey(Number(levelDepth));
            let data: mainContenItemData =
            {
                id: 2,
                value: depthVo.depth,
                expend: depthVo.expend
            };
            targetNode.getComponent(mainContentItem_Component).init(2, data, false);
        } else if (id == 3) {
            self.guideContent.getChildByName("arrow2").active = false;
            self.guideContent.getChildByName("arrow3").active = false;

            //刷新3 的 ui
            let targetNode = self._mainDownBackView.getChildByName("3");
            if (!targetNode) {
                targetNode = self._mainDownFrontView.getChildByName("3");
            }
            let outline = self._gameManager.getLevelOutline();
            let outlineVo = T_OutLine_Table.getVoByKey(Number(outline));
            let data: mainContenItemData =
            {
                id: 3,
                value: outlineVo.income,
                expend: outlineVo.expend
            };
            targetNode.getComponent(mainContentItem_Component).init(3, data, false);
        }
        itemNode.removeAllChildren();
        self.guideContent.active = false;

        //开始展示宝箱
        if (self._gameManager.getGameGuide() == 4 && self._gameManager.getIsChannel()) {
            self.showGuideBaoXiang();
        }
    }

    //引导用户点击宝箱
    showGuideBaoXiang() {
        // cc.log("???");
        this.baoXiangContent.active = true;
        let desLab = this.baoXiangContent.getChildByName("desLab").getComponent(cc.Label);
        desLab.string = "快看看宝箱里边有什么!";
    }

    showGuideHand() {
        //新手引导
        this.guideHand.active = true;
        let width = cc.view.getVisibleSize().width;
        let moveAct1 = cc.moveTo(1, cc.v2(width / 2, this.guideHand.y));
        let moveAct2 = cc.moveTo(1, cc.v2(-width / 2, this.guideHand.y));
        let seqAct = cc.sequence(moveAct1, moveAct2);
        this.guideHand.runAction(cc.repeat(seqAct, 2));
        this.scheduleOnce(() => {
            this.guideHand.active = false;
        }, 4)
    }

    //升级深度
    showGuideUpgradeDepth() {
        //把 深度节点拿出来放到 guide节点上
        this.guideContent.active = true;
        let itemNode = this.guideContent.getChildByName("mainItem");
        let arrow = this.guideContent.getChildByName("arrow");
        let desLab = this.guideContent.getChildByName("desLab").getComponent(cc.Label);

        let targetNode = this._mainDownBackView.getChildByName("2");
        if (!targetNode) {
            targetNode = this._mainDownFrontView.getChildByName("2");
        }
        // let pos = targetNode.parent.convertToWorldSpaceAR(targetNode.position);
        let pos = targetNode.position;
        cc.log("pos--->>", pos);
        let item = cc.instantiate(this.mainDownItem);
        let depth = this._gameManager.getLevelDepth();
        let depthVo = T_Depth_Table.getVoByKey(Number(depth));
        let data: mainContenItemData =
        {
            id: 2,
            value: depthVo.depth,
            expend: depthVo.expend
        };
        item.getComponent(mainContentItem_Component).init(2, data, true);
        itemNode.addChild(item);
        item.position = pos;
        // itemNode.position = itemNode.convertToNodeSpaceAR(pos);
        arrow.x = item.x;
        desLab.string = "升级深度来挖的更深！";
    }

    //升级容量
    shouGuideUpgradeWare() {
        this.guideContent.active = true;
        let itemNode = this.guideContent.getChildByName("mainItem");
        let arrow = this.guideContent.getChildByName("arrow");
        let desLab = this.guideContent.getChildByName("desLab").getComponent(cc.Label);

        let targetNode = this._mainDownBackView.getChildByName("1");
        if (!targetNode) {
            targetNode = this._mainDownFrontView.getChildByName("1");
        }
        // let pos = targetNode.parent.convertToWorldSpaceAR(targetNode.position);
        let pos = targetNode.position;
        let item = cc.instantiate(this.mainDownItem);
        let warehouse = this._gameManager.getLevelWarehouse();
        let warehouseVo = T_Warehouse_Table.getVoByKey(Number(warehouse));
        let data: mainContenItemData =
        {
            id: 1,
            value: warehouseVo.count,
            expend: warehouseVo.expend
        };
        item.getComponent(mainContentItem_Component).init(1, data, true);
        item.position = pos;
        itemNode.addChild(item);
        arrow.x = item.x;
        desLab.string = "升级仓库来携带更多宝物！";
    }

    //展示 升级其他
    showGuideUpgradeOther() {
        this.guideContent.active = true;
        let itemNode = this.guideContent.getChildByName("mainItem");
        let arrow = this.guideContent.getChildByName("arrow");
        let arrow2 = this.guideContent.getChildByName("arrow2");
        let arrow3 = this.guideContent.getChildByName("arrow3");
        let desLab = this.guideContent.getChildByName("desLab").getComponent(cc.Label);
        arrow2.active = true;
        arrow3.active = true;


        let targetNode1 = this._mainDownBackView.getChildByName("1");
        if (!targetNode1) {
            targetNode1 = this._mainDownFrontView.getChildByName("1");
        }
        // let pos1 = targetNode1.parent.convertToWorldSpaceAR(targetNode1.position);
        let pos1 = targetNode1.position;

        let targetNode2 = this._mainDownBackView.getChildByName("2");
        if (!targetNode2) {
            targetNode2 = this._mainDownFrontView.getChildByName("2");
        }
        // let pos2 = targetNode2.parent.convertToWorldSpaceAR(targetNode2.position);
        let pos2 = targetNode2.position;

        let targetNode3 = this._mainDownBackView.getChildByName("3");
        if (!targetNode3) {
            targetNode3 = this._mainDownFrontView.getChildByName("3");
        }
        // let pos3 = targetNode3.parent.convertToWorldSpaceAR(targetNode3.position);
        let pos3 = targetNode3.position;

        //获取数据
        let warehouse = this._gameManager.getLevelWarehouse();
        let depth = this._gameManager.getLevelDepth();
        let outline = this._gameManager.getLevelOutline();
        let warehouseVo = T_Warehouse_Table.getVoByKey(Number(warehouse));
        let depthVo = T_Depth_Table.getVoByKey(Number(depth));
        let outlineVo = T_OutLine_Table.getVoByKey(Number(outline));
        //下一段要解锁的
        // 包装数据
        let obj: Array<mainContenItemData> = [{
            id: 1,
            value: warehouseVo.count,
            expend: warehouseVo.expend
        }, {
            id: 2,
            value: depthVo.depth,
            expend: depthVo.expend
        }, {
            id: 3,
            value: outlineVo.income,
            expend: outlineVo.expend
        }];
        for (let i = 1; i <= 3; i++) {
            let item = cc.instantiate(this.mainDownItem);
            item.getComponent(mainContentItem_Component).init(i, obj[i - 1], true);
            itemNode.addChild(item);
            if (i == 1) {
                item.position = pos1;
                arrow2.x = item.x;
            } else if (i == 2) {
                item.position = pos2;
                arrow.x = item.x;
            } else if (i == 3) {
                item.position = pos3;
                arrow3.x = item.x;
            }
        }
        desLab.string = "来升级吧！";
    }

    //引导
    showGameGuide(id: number) {
        cc.log("新手引导id--->>", id);
        switch (id) {
            case 1:
                //小手
                this.showGuideHand();
                break;
            case 2:
                //显示 升级深度
                this.showGuideUpgradeDepth();
                break;
            case 3:
                //显示 升级容量
                this.shouGuideUpgradeWare();
                break;
            case 4:
                //显示来升级吧
                this.showGuideUpgradeOther();
                cc.log("新手引导完成");
                break;
        }
        this._gameManager.saveData(saveName.GAMEGUIDE, id);
    }

    //展示渠道宝箱view
    onClickBaoxiang(event) {
        // cc.log(event.customEventData);
        this.baoXiangContent.active = false;
        this.baoXiangView.active = true;
        if (this._gameManager.getGameGuide() === 4) {
            this.baoXiangView.getComponent(BaoxiangView).showView(100, true);
        }
    }

    //结果分数面板
    showScoreView(score: number, itemList: Array<T_Item> = null) {
        this.offLineUI.active = true;
        this.offLineUI.getComponent(OfflineView).showScore(score, itemList);
    }

    hideScoreView() {
        this.offLineUI.active = false;
    }

    showMainView() {
        this.mainNode.active = true;
        this.setting.active = true;
        this._mainDrill.active = false;
        this.baoxiangBtn.active = true;
    }

    //设置ui状态
    hideMainView() {
        //隐藏
        this.mainNode.active = false;
        this.setting.active = false;
        this._mainDrill.active = true;
        this.baoxiangBtn.active = false;
    }

    showHUDView() {
        //显示HUD 界面
        this.HUDUi.active = true;
    }

    hideHUDView() {
        //隐藏HUD 界面
        this.HUDUi.active = false;
    }

    //刷新收集数量统计
    updateHUDView(score: number, total: number) {
        let socreLab = this.HUDUi.getChildByName("score").getComponent(cc.Label);
        let spFilled = this.HUDUi.getChildByName("fill_front").getComponent(cc.Sprite);
        spFilled.fillStart = score / total;
        socreLab.string = score + "/" + total;
    }

    registerEvent() {
        this.mCanvas.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.mCanvas.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.mCanvas.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.mCanvas.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    disableEvent() {
        this.mCanvas.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.mCanvas.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.mCanvas.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.mCanvas.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event) {
        cc.log("start--");
        var location = event.getLocation();
        this._preMovePos = location;
        this._isTouch = true;
    }

    _touchMoveTime: number;
    onTouchMove(event: cc.Event.EventTouch) {
        let currentTime = Date.now();
        // cc.log("disTime-->>", currentTime - this._touchMoveTime);
        if (currentTime - this._touchMoveTime < 20) {
            // cc.log("太频繁了吧");
        } else {
            this._touchMoveTime = currentTime;
        }
        let pos = event.getLocation();
        let subVect = pos.sub(this._preMovePos);
        let radian = Math.atan2(subVect.x, subVect.y);
        let degrees = cc.misc.radiansToDegrees(radian);
        let disDegress = degrees - this._preDegress;
        if (Math.abs(disDegress) > 20) {
            if (disDegress > 0) {
                degrees = this._preDegress + 20;
            } else {
                degrees = this._preDegress - 20;
            }
        } else {
            // cc.log("disDegress--->>", disDegress);
        }
        if (degrees > 60) {
            degrees = 60;
        }
        if (degrees < -60) {
            degrees = - 60;
        }
        this.drill.angle = -degrees;
        this._preDegress = degrees;
        let x = (pos.x - this._preMovePos.x); //* Math.abs(Math.sin(cc.misc.degreesToRadians(degrees)));
        if (x > 20) {
            x = 20;
        }
        this.drill.x += 2 * x;
        this._preMovePos = pos;
    }
    onTouchEnd(event) {
        cc.log("end--");
        this._isTouch = false;
    }

    onClickSetting() {
        //setting  
        this.settingUI.active = true;
        this.clickBtnAudio();
    }

    // 点击box
    onClickShowBox() {
        this.showBoxUI.active = true;
        // this.scheduleOnce(() => {
        // this.node.position = cc.v2(0, this.node.y + this.node.height);
        let moveAct = cc.moveTo(0.5, cc.v2(0, 0));
        this.showBoxUI.runAction(moveAct);
        // }, 1)
        this.clickBtnAudio();
    }

    //开始游戏
    onClickStart(obj: any, target: any) {
        let id = Number(obj);
        let self = target as Helloworld;
        self.hideMainView();

        //新手引导
        cc.log("下沉深度--->>", self._currentDepth);
        //生成item
        // self.showPopItemAnimView();
        self.randomCreateItem();
        self.showHUDView();
        let warhouseVo = T_Warehouse_Table.getVoByKey(self._levelWarehouse);
        self.updateHUDView(0, warhouseVo.count);

        self.drill = self._mainView.getComponent(MainView).getItemNode();
        self.drill.setPosition(cc.v2(0, 80));
        self.drillClass = self.drill.getComponent(Item_Component);
        self.drillClass.startRun();
        self.drill.getComponent(cc.BoxCollider).enabled = false;
        self._mainDrill.addChild(self.drill);

        //新手引导生成一个宝箱
        if (this._gameManager.getIsChannel() && this._gameManager.getGameGuide() <= 1) {
            //   cc.instantiate();
        }

        let moveAct = cc.moveBy(0.3, cc.v2(self.drill.x, self.drill.y + 100));
        let rotateAct = cc.rotateBy(0.3, -180);
        self._currentState = moveState.rotate;
        let moveAct2 = cc.moveBy(0.2, cc.v2(self.drill.x, self.drill.y - 100));
        let spawnAct2 = cc.spawn(moveAct2, cc.callFunc(() => {
            //粒子效果
            self.drillClass.startPuncture();
            //火焰喷射效果
            self.drillClass.startFlame();
            //钻头效果
            self.drillClass.startTopAnim();
            //开启音效
            GameManager.audioManger.stopBGM();
            GameManager.audioManger.playSFX(self.startAudio);
        }));
        let seqAct = cc.sequence(cc.sequence(moveAct, rotateAct), spawnAct2, cc.callFunc(() => {
            self._currentState = moveState.down;
            //动作下去
            let moveDownAct = cc.moveBy(2, cc.v2(self.drill.x, self.drill.y - self._currentDepth)).easing(cc.easeOut(1.0));
            let seqDownAct = cc.sequence(moveDownAct, cc.callFunc(() => {
                self.runToTargetDownDepth();
            }))
            self.drill.runAction(seqDownAct);
        }))
        self.drill.runAction(seqAct);
    }

    update(dt) {
        if (!this.drill) {
            return;
        }
        if (moveState.rotate === this._currentState || moveState.normal === this._currentState) {
            return;
        }
        //到目标底部了  回去
        // if (this.drill.y <= -this._currentDepth && (this._currentState == moveState.down)) {
        //     this.runToTargetDownDepth();
        // }
        //到限定高度了  迅速返回
        if (this.drill.y >= -this.targetDepth && (this._currentState == moveState.up)) {
            this.runToTargetUpDepth();
        }

        switch (this._currentState) {
            case moveState.up:
                this.drillUp(dt);
                break;
            case moveState.rocketup:
                this.camera.node.y = this.drill.y;
                break;
            case moveState.down:
                this.drillDown(dt);
                break;
            // case moveState.rotate:
            //     this.drillRotate();
            //     break;
            // case moveState.normal:
            //     this.drillNormal();
            //     break;
        }
    }

    runToTargetUpDepth() {
        cc.log("y====>>>", this.drill.y);
        if (this._currentState === moveState.rocketup) {
            return;
        }
        this.drillRocketUp();
        //设置状态
        this._currentState = moveState.rocketup;

    }

    //下来到底部开始往上了
    runToTargetDownDepth() {
        this.drillClass.stopFlame();
        cc.log("旋转")
        let rotateAct = cc.rotateBy(0.3, 180).easing(cc.easeIn(3.0));
        this._currentState = moveState.rotate;
        let seqAct = cc.sequence(rotateAct, cc.callFunc(() => {
            //判断新手引导
            if (this._gameManager.getGameGuide() == 0) {
                this.showGameGuide(1);
            }
            this._currentState = moveState.up;
        }))
        this.drill.runAction(seqAct);
        GameManager.audioManger.playSFX(this.wheelAudio);
    }

    drillUp(dt) {
        // cc.log('drillUp')
        // cc.log(this.drill.y);
        //碰撞组件开启
        this.drill.getComponent(cc.BoxCollider).enabled = true;
        //做拖尾效果
        this.drillClass.startMotionStreak();
        // GameManager.audioManger.playBGM(this.loopAudio, 0.2);
        GameManager.audioManger.playBGM(this.loopAudio);
        // cc.audioEngine.play(this.loopAudio, true, 0.1);

        this.registerEvent();
        this.drill.y += this.upSpeed * dt;
        if (!this._isTouch) {
            if (this.drill.angle >= 2) {
                this.drill.angle -= 2;
            } else if (this.drill.angle <= -2) {
                this.drill.angle += 2;
            } else {
                this.drill.angle = 0;
            }
        }
        this.camera.node.y = this.drill.y + 300;

        //不能超过屏幕的宽度
        if (this.drill.x > 300) {
            this.drill.x = 300;
        }
        if (this.drill.x < -300) {
            this.drill.x = -300;
        }
    }

    drillRocketUp() {
        cc.log('drillRocketUp')
        //关闭碰撞
        this.drill.getComponent(cc.BoxCollider).enabled = false;
        //取消监听
        this.disableEvent();
        // GameManager.audioManger.playBGM(this.rocketLoopAudio, 1);
        GameManager.audioManger.playBGM(this.rocketLoopAudio);
        //运行动作
        let rotateAct = cc.rotateTo(0.2, 0);
        let moveAct = cc.moveTo(1.0, cc.v2(0, 0)).easing(cc.easeIn(3.0));
        let seqAct = cc.sequence(rotateAct, moveAct, cc.callFunc(() => {
            this.completeGame();
        }));
        this.drill.runAction(seqAct);

        if (this.drill.y < 100) {
            this.camera.node.y = this.drill.y;
        }
    }

    drillDown(dt) {
        // cc.log('drillDown')
        // this.drill.y -= this.mSpeed * dt * 10;
        if (this.drill.y <= -300) {
            this.camera.node.y = this.drill.y;
        }
    }

    drillRotate() {

    }

    drillNormal() {

    }

    //随机生成道具
    randomCreateItem() {
        //根据深度和 解锁的钻头 生成 道具
        // let depthLevel = this._gameManager.getLevelDepth();
        // let unlockList = this._gameManager.getUnlockList();
        // let maxId = Number(unlockList[unlockList.length - 1]);
        // let unlockVo = T_Unlock_Table.getVoByKey(maxId);

        //共 68个 等级
        //每升4个等级  升一个格子
        let count = Math.ceil(this._levelDpeth / 4) + 1;

        let allVo = T_Unlock_Table.getAllVo();
        //格子数量
        // let count = Math.ceil((this._currentDepth - this.constNum) / 2 / 752);
        for (let i = 0; i <= count; i++) {
            for (let j = 0; j < this.gridNumebrItem; j++) {
                let randx = Math.random() > 0.5 ? Math.random() * 320 : Math.random() * -320;
                let randy = Math.random() * 752;
                //格子改了 x2 深度也x2;
                let nodey = (i + 4) * 752 - (752 - randy);
                let pos = cc.v2(randx, -nodey);
                let inx = Math.floor(i / 2);
                if (inx == 0) { inx = 1; }
                let voItem = allVo[inx].value.split("_");
                //随机0到3
                let index = Math.floor(Math.random() * 4);
                let itemId = Number(voItem[index]);

                //生成 宝箱
                // if (Math.random() > 0.05) {
                //     //生成一个宝箱

                // }

                //  1/5的概率是金色的
                let isGold = Math.random() * 10 <= 1;
                let item = this.nodePool.get();
                if (!item) {
                    item = cc.instantiate(this.propItem);
                    cc.log("重新生成item");
                }
                item.scale = 0.6;
                item.angle = 0;
                item.stopAllActions();
                item.getComponent(propItem_Component).init(itemId, isGold);
                item.position = pos;
                this.gameItemContent.addChild(item);
            }
        }
    }

    //获得道具
    getItemByDrill(obj: any, target: any) {
        let self = target as Helloworld;
        let data = obj as collectItemData;
        self._itemNumber++;
        self._collectList.push(data);
        let warhouseVo = T_Warehouse_Table.getVoByKey(self._levelWarehouse);
        //判断是否收集够了
        if (self._itemNumber >= warhouseVo.count) {
            //关闭碰撞
            self.drill.getComponent(cc.BoxCollider).enabled = false;
            //收集够了 ,开始加速上升
            self.runToTargetUpDepth();
        }
        self.updateHUDView(self._itemNumber, warhouseVo.count);
    }

    //游戏完成
    completeGame() {
        this.drillClass.stopFlame();
        this.drillClass.stopTopAnim();
        this.drillClass.stopPuncture();
        this.drillClass.stopMotionStreak();
        //倾斜90度
        this.drillClass.popItemAnim();

        //弹出礼物界面
        let moveAct = cc.moveBy(0.2, cc.v2(this.drill.x, this.drill.y + 100));
        let moveAct2 = cc.moveTo(0.5, cc.v2(0, 0));
        let seqAct = cc.sequence(cc.spawn(moveAct, cc.callFunc(() => {
            //弹出礼物
            //从nodepool 中获取礼物, 抛洒动作
            this.resultAnim();
        })), moveAct2);
        this.drill.runAction(seqAct);

        this._currentState = moveState.normal;
        GameManager.audioManger.playSFX(this.topAudio);
        GameManager.audioManger.playBGM(this.hallAudio);
        //弹出结果

        //检测解锁钻头
        //重置界面
        //隐藏积分面板
        this.hideHUDView();
    }

    //结算动画
    resultAnim() {
        //收集到的道具
        let pos = this._mainDrill.convertToWorldSpaceAR(cc.v2(this.drill.x, this.drill.y + 50));
        let newPos = this.popItemContent.convertToNodeSpaceAR(pos);
        //对半 一半左边 一半右边
        for (let i = 0; i < this.collectNodeList.length; i++) {
            let item = this.collectNodeList[i];
            item.parent = this.popItemContent;
            //显示拖尾组件
            item.getComponent(propItem_Component).showMK();
            item.active = true;
            item.position = newPos;
            item.scale = 1;
            let x = Math.random() * 200;
            let y = Math.random() * 2000;

            let posArr = new Array<cc.Vec2>();
            posArr.push(item.position);

            let midPos;
            let targetPos;
            if (i > Math.floor(this.collectNodeList.length / 2)) {
                midPos = cc.v2(item.x - x / 2, item.y + y);
                targetPos = cc.v2(item.x - x, item.y)
            } else {
                midPos = cc.v2(item.x + x / 2, item.y + y);
                targetPos = cc.v2(item.x + x, item.y)
            }
            posArr.push(midPos);
            posArr.push(targetPos);
            //开始抛物线动画
            let bezierAct = cc.bezierBy(3, posArr);
            let scaleAct = cc.scaleTo(3, 0.6);
            let seqAct = cc.sequence(cc.spawn(bezierAct, scaleAct), cc.callFunc(() => {
                item.getComponent(propItem_Component).hideMK();
                item.stopAllActions();
                item.scale = 0.6;
                item.removeFromParent();
                this.nodePool.put(item);
            }));
            item.runAction(seqAct);
        }

        //开始弹出 特效动画
        let i = 0;
        let count = 0;
        this.schedule(() => {
            // for (let i = 0; i < this._collectList.length; i++) {
            let itemVo = this._collectList[i];
            let item = this.nodePool.get();
            if (!item) {
                item = cc.instantiate(this.propItem);
            }
            item.getComponent(propItem_Component).init(itemVo.id, itemVo.isGold);
            this.showItemContent.zIndex = cc.macro.MAX_ZINDEX;
            this.showItemContent.addChild(item);

            item.position = cc.v2(0, 0);
            item.scale = 0;
            let scaleAct = cc.scaleTo(0.1, 2);
            let seqAct = cc.sequence(scaleAct, cc.callFunc(() => {
                item.scale = 0.6;
                item.removeFromParent();
                this.nodePool.put(item);
            }))
            item.runAction(seqAct);

            //还有 label

            let itemLab = this.labItemPool.get();
            if (!itemLab) {
                itemLab = cc.instantiate(this.labItem);
            }
            let itemTable = T_Item_Table.getVoByKey(itemVo.id);
            itemLab.getComponent(labItem_Component).init(itemVo.isGold, itemTable.value);
            this.showLabItemContent.addChild(itemLab);
            i++;
        }, 0.1, this._collectList.length - 1, 0);

        let time = 1 + this._collectList.length * 0.1;
        //不管了  time 后弹出
        this.scheduleOnce(() => {
            let itemArr = new Array<T_Item>();
            let goldItemArr = new Array<T_Item>();
            for (let i = 0; i < this._collectList.length; i++) {
                let itemVo = this._collectList[i];
                let itemTable = T_Item_Table.getVoByKey(itemVo.id);
                count += itemTable.value;

                let isHave = GameUtil.getItemIsHave(itemVo.id);
                //解锁道具
                if (!isHave) {
                    this._gameManager.saveData(saveName.USERITEM, itemVo.id);
                    itemArr.push(T_Item_Table.getVoByKey(itemVo.id));
                }
                if (itemVo.isGold) {
                    let isHave = GameUtil.getGoldItemIsHave(itemVo.id);
                    if (!isHave) {
                        this._gameManager.saveData(saveName.USERGOLDITEM, itemVo.id);
                        goldItemArr.push(T_Item_Table.getVoByKey(itemVo.id));
                    }
                }
            }
            //去重
            let newItemList = GameUtil.deleteWeight(itemArr);
            let newGoldItemList = GameUtil.deleteWeight(goldItemArr);
            cc.log(newItemList);
            cc.log(newGoldItemList);

            cc.log("本次收集金币数-->>", count);
            cc.log("本次收获新道具-->>", newItemList);
            cc.log("本次收获新金色道具-->>", newGoldItemList);
            //获取多个道具  多个钻头解锁
            //判断是否解锁钻头
            // let unlockList = this._gameManager.getUnlockList();
            // let maxId = unlockList[unlockList.length - 1];
            //无论是否解锁 都发消息
            _Notification_.send(NotifyEnum.UNLOCKDRILL);
            // let flag = GameUtil.isCanUnlockDrill(Number(maxId) + 1);
            // if (flag) {
            //     _Notification_.send(NotifyEnum.UNLOCKDRILL);
            // }
            //可以解锁下一个
            //是否有新解锁的道具
            this.resetGame();
            this.showScoreView(count, newItemList);
            this.showMainView();
            //判断是否需要展示新手引导
            this.showGuide();
        }, time);
    }

    showGuide() {
        if (this._gameManager.getGameGuide() == 1) {
            this.showGameGuide(2);
        } else if (this._gameManager.getGameGuide() == 2) {
            this.showGameGuide(3);
        } else if (this._gameManager.getGameGuide() == 3) {
            this.showGameGuide(4);
        }
    }

    //重新设置游戏
    resetGame() {
        if (this.drill) {
            this.drill.destroy();
        }
        this.drill = null;
        this.drillClass = null;

        this._preMovePos = null;
        this._preDegress = 0;
        this._currentState = moveState.normal;

        //收集到的道具数量
        this._itemNumber = 0;
        this._collectList.length = 0;
        this.collectNodeList.length = 0;
        this._currentDepth = 0;
        this.initData();

        for (let i = 0; i < this.popItemContent.childrenCount; i++) {
            let item = this.popItemContent.children[i];
            if (item) {
                item.stopAllActions();
                item.removeFromParent();
                this.nodePool.put(item);
                // item.destroy();
            }
        }

        for (let i = 0; i < this.gameItemContent.childrenCount; i++) {
            let gameItem = this.gameItemContent.children[i];
            if (gameItem) {
                gameItem.stopAllActions();
                gameItem.removeFromParent();
                this.nodePool.put(gameItem);
            }
        }

        for (let i = 0; i < this.showItemContent.childrenCount; i++) {
            let item = this.showItemContent.children[i];
            if (item) {
                item.stopAllActions();
                item.removeFromParent();
                this.nodePool.put(item);
            }
        }

        for (let i = 0; i < this.showLabItemContent.childrenCount; i++) {
            let item = this.showLabItemContent.children[i];
            if (item) {
                item.stopAllActions();
                item.removeFromParent();
                item.destroy();
            }
        }
    }

    //收集金币
    playCollectMoneyAudio() {
        GameManager.audioManger.playSFX(this.collectMoneyAudio);
    }

    //金色道具 audio
    playItemGoldAudio() {
        GameManager.audioManger.playSFX(this.itemGoldAudio);
    }
    //普通道具 audio
    playItemNormalAudio() {
        GameManager.audioManger.playSFX(this.itemNormalAudio);
    }

    //点击按钮音效
    clickBtnAudio() {
        GameManager.audioManger.playSFX(this.clickAudip);
    }

    //关闭音效
    clickCloseAudio() {
        GameManager.audioManger.playSFX(this.closeAudio);
    }

    //点击购买升级
    clickUpgradeAudio() {
        GameManager.audioManger.playSFX(this.upgradeAudio);
    }
}