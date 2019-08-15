import { moveState, NotifyEnum, mainContenItemData, collectItemData, saveName, mainContentItemState, STRING, Statistics } from "./Interface";
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
import RedPacketView from "./RedPacketView";
import LoadUtils from "./Util/LoadUtils";
import ExChange from "./ExChange";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Node)
    mainNode: cc.Node = null;

    @property(cc.Node)
    setting: cc.Node = null;

    @property(cc.Prefab)
    propItem: cc.Prefab = null;

    @property(cc.Prefab)
    mainDownItem: cc.Prefab = null;

    @property(cc.Prefab)
    redPackektItem: cc.Prefab = null;

    @property(cc.Prefab)
    labItem: cc.Prefab = null;

    // @property(cc.Prefab) //结束后弹出红包界面 预制体
    // redPakcetUIPrefab: cc.Prefab = null;

    @property(cc.Node) //结束后弹出红包界面
    redPakcetUI: cc.Node = null;

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

    // @property(cc.SpriteAtlas)  //图集
    // itemSpriteAtlas: cc.SpriteAtlas = null;

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

    @property(cc.Node)  //兑换界面
    exChangeView: cc.Node = null;

    @property(cc.Node)  //新手引导完成界面
    guideOverView: cc.Node = null;
    
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

    //=================
    //音效
    hallAudio: cc.AudioClip = null;
    clickAudip: cc.AudioClip = null;
    closeAudio: cc.AudioClip = null;
    upgradeAudio: cc.AudioClip = null;
    startAudio: cc.AudioClip = null;
    wheelAudio: cc.AudioClip = null;
    loopAudio: cc.AudioClip = null;
    drillup_audio: cc.AudioClip = null;
    topAudio: cc.AudioClip = null;
    moneyAudio: cc.AudioClip = null;
    itemNormalAudio: cc.AudioClip = null;
    itemGoldAudio: cc.AudioClip = null;
    //================ 
    //钻头
    drill: cc.Node = null;
    drillClass: Item_Component = null;
    _mainView: cc.Node = null;
    _mainDrill: cc.Node = null;
    // _mainDownView: cc.Node = null;
    _mainDownBackView: cc.Node = null;
    _mainDownFrontView: cc.Node = null;
    _mainDownItemList: Array<cc.Node> = new Array();

    //状态
    _preMovePos: cc.Vec2 = null;
    _preDegress: number = 0;
    _currentState: moveState = moveState.normal;

    _gameManager: GameManager = null;

    //道具节点池
    // nodePool: cc.NodePool = null;
    // lab item 节点池
    // labItemPool: cc.NodePool = null;

    //收集到的道具数量
    _itemNumber: number = 0;
    _levelDpeth: number = 0;
    _levelWarehouse: number = 0;
    _collectList: Array<collectItemData> = new Array();
    collectNodeList: Array<cc.Node> = new Array(); //道具
    redPacketNodeList: Array<cc.Node> = new Array();//红包

    //深度
    constNum: number = 3860;
    _currentDepth: number = 0;

    _isTouch: boolean = false;
    _isMove: boolean = false;
    onLoad() {
        this._gameManager = GameManager.getInstance();
    }

    start() {
        this.initData();
        this.initView();
        this.initGame();
        this.initAudio();
        this.initGameGudie();
        //注册监听
        _Notification_.subscrib(NotifyEnum.CLICK_START, this.onClickStart, this);
        _Notification_.subscrib(NotifyEnum.UPDATEMONEY, this.updateMoneyLab, this);
        _Notification_.subscrib(NotifyEnum.UPDATEDEPTH, this.updateDepth, this);
        _Notification_.subscrib(NotifyEnum.UPDATEMAINITEM, this.updateMainUI, this);
        _Notification_.subscrib(NotifyEnum.GETITEMBYDRILL, this.getItemByDrill, this);
        _Notification_.subscrib(NotifyEnum.CLICKCOLLECT, this.clickCollect, this);
        _Notification_.subscrib(NotifyEnum.HIDEGAMEGUIDE, this.hideGameGuide, this);
        _Notification_.subscrib(NotifyEnum.UPGRADENOMONEY, this.showExChange, this);
        _Notification_.subscrib(NotifyEnum.GUIDEOVER, this.showGudieOver, this);
    }

    onDestroy() {
        _Notification_.unsubscrib(NotifyEnum.CLICK_START, this.onClickStart);
        _Notification_.unsubscrib(NotifyEnum.UPDATEMONEY, this.updateMoneyLab);
    }

    initData() {
        //获取当前下潜深度
        this._levelDpeth = Number(this._gameManager.getLevelDepth());
        this._levelWarehouse = Number(this._gameManager.getLevelWarehouse());
        //需要生成item占用 格子的数量
        // let gridNumber = (levelDpeth * self.perLevelDis) / 752;
        // self._currentDepth = gridNumber * 2 * 752;
        this._currentDepth = this.constNum + this._levelDpeth * this.perLevelDis;
        cc.log("当前深度-->>", this._currentDepth);
    }

    initView() {
        this._mainView = this.mainNode.getChildByName("mainView");
        this._mainDrill = this.node.getChildByName("drill_main");
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
            this._mainDownItemList.push(item);
        }
    }

    initMoneyLab() {
        this.moneyLab.string = "$" + this._gameManager.getUserCount();
    }

    /**
     * 首先检查离线收益 弹出对话框
     * 初始化全局的道具和钻头
     */
    initGame() {
        let income = this._gameManager.getOfflineIncome();
        if (income > 0) {
            this.offLineUI.active = true;
            this.offLineUI.getComponent(OfflineView).showOffline();
        } else {
            this.offLineUI.active = false;
        }
    }

    //初始化音效
    initAudio() {
        this.moneyAudio = cc.loader.getRes("audio/money_audio");
        this.hallAudio = cc.loader.getRes("audio/hall_audio");
        this.clickAudip = cc.loader.getRes("audio/click_audio");
        this.closeAudio = cc.loader.getRes("audio/close_audio");
        this.upgradeAudio = cc.loader.getRes("audio/upgrade_audio");
        this.startAudio = cc.loader.getRes("audio/start_audio");
        this.wheelAudio = cc.loader.getRes("audio/wheel_audio");
        this.loopAudio = cc.loader.getRes("audio/loop_audio");
        this.drillup_audio = cc.loader.getRes("audio/drillup_audio");
        this.topAudio = cc.loader.getRes("audio/top_audio");
        this.itemNormalAudio = cc.loader.getRes("audio/itemNormal_audio");
        this.itemGoldAudio = cc.loader.getRes("audio/itemGold_audio");

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

    //==============================================监听方法====================================================
    updateMainUI(obj: any, target: any) {
        let self = target as Helloworld;
        let id = Number(obj);
        self.initData();

        if (id == 1) {
            GameManager.Statistics(Statistics.UPGRADE_STORAGE);
        } else if (id == 2) {
            GameManager.Statistics(Statistics.UPGRADE_DEPTH);
        } else if (id == 3) {
            GameManager.Statistics(Statistics.UPGRADE_OFFLINE);
        }

        //不要这样刷新
        //获取他们的引用自己刷新
        if (self._mainDownItemList.length > 0) {
            for (let i = 0; i < self._mainDownItemList.length; i++) {
                let item = self._mainDownItemList[i];
                item.getComponent(mainContentItem_Component).updateParent();
            }
        }
        // for (let i = 0; i < self._mainDownFrontView.childrenCount; i++) {
        //     let item = self._mainDownFrontView.children[i];
        //     item.getComponent(mainContentItem_Component).updateParent();
        // }

        // for (let i = 0; i < self._mainDownBackView.childrenCount; i++) {
        //     let item = self._mainDownBackView.children[i];
        //     item.getComponent(mainContentItem_Component).updateParent();
        // }
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
        }
    }

    hideGameGuide(obj: any, target: any) {
        // cc.log("hideGameGuide-->>");
        let self = target as Helloworld;
        let id = Number(obj);
        let itemNode = self.guideContent.getChildByName("mainItem");
        if (id == 1) {
            //刷新1 的ui
            let targetNode = self._mainDownItemList[0];
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
            let targetNode = self._mainDownItemList[1];
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
            let targetNode = self._mainDownItemList[2];
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
        if (self._gameManager.getGameGuide() == 2 && self._gameManager.getIsChannel()) {
            // self.showGuideBaoXiang();
            self.showGameGuide(5);
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
            self.scheduleOnce(() => {
                //收集够了 ,开始加速上升
                self.runToTargetUpDepth();
            }, 0.1);
        }
        self.updateHUDView(self._itemNumber, warhouseVo.count);
    }

    /** 展示引导评论对话框 */
    showGudieOver(obj: any, target: any) {
        let self = target as Helloworld;
        self.guideOverView.active = true;
        // self.guideOverView.getComponent(ExChange).showExChangeView();
    }

    /** 展示 兑换金币界面 */
    showExChange(obj: any, target: any) {
        let self = target as Helloworld;
        self.exChangeView.active = true;
        self.exChangeView.getComponent(ExChange).showExChangeView();
    }

    //引导用户点击宝箱
    showGuideBaoXiang() {
        // cc.log("???");
        this.baoXiangContent.active = true;
        let desLab = this.baoXiangContent.getChildByName("desLab").getComponent(cc.Label);
        desLab.string = STRING.guide4;
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
        desLab.string = STRING.guide1;
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
        desLab.string = STRING.guide2;
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
        desLab.string = STRING.guide3;
    }

    showGuide() {
        if (this._gameManager.getGameGuide() == 1) {
            this.showGameGuide(2);
        } else if (this._gameManager.getGameGuide() == 2) {
            // this.showGameGuide(3);
        } else if (this._gameManager.getGameGuide() == 3) {
            this.showGameGuide(4);
        }
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
            case 5:
                this.showGuideBaoXiang();
                break;
        }
        this._gameManager.saveData(saveName.GAMEGUIDE, id);
    }

    //展示渠道宝箱view
    onClickBaoxiang(event, data) {
        // cc.log(data);
        //音效
        this.clickBtnAudio();
        this.baoXiangContent.active = false;
        this.baoXiangView.active = true;
        let trueMoney = this._gameManager.getTrueMoney();
        if (data == "111") {
            //新手引导
            // let income = GameUtil.getFirstRedPacket();
            this.baoXiangView.getComponent(BaoxiangView).showView(trueMoney, true);
        } else {
            this.baoXiangView.getComponent(BaoxiangView).showView(trueMoney, false);
        }
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

    //===================================show/hide  View =============================================
    //结果分数面板
    showScoreView(score: number, itemList: Array<T_Item> = null) {
        this.offLineUI.active = true;
        this.offLineUI.getComponent(OfflineView).showScore(score, itemList);
    }

    hideScoreView() {
        this.offLineUI.active = false;
    }

    /**
     *  弹出红包动画
     */
    showRedPacket(cb: Function = null) {
        // let redItem = cc.instantiate(this.redPakcetUIPrefab);
        // redItem.getComponent(RedPacketView).showView(cb);
        // this.node.addChild(redItem);
        this.redPakcetUI.active = true;
        this.redPakcetUI.getComponent(RedPacketView).showView();
    }

    hideRedPacket(cb: Function = null) {
        this.redPakcetUI.active = false;
        // this.redPakcetUI.getComponent(RedPacketView).showView();
    }

    showMainView() {
        this.mainNode.active = true;
        this.setting.active = true;
        this._mainDrill.active = false;

        if (this._gameManager.getIsChannel()) {
            this.baoxiangBtn.active = true;
        } else {
            this.baoxiangBtn.active = false;
        }
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
        if (score > total) {
            score = total;
        }
        spFilled.fillStart = score / total;
        socreLab.string = score + "/" + total;
    }

    //========================================Game main logic================================
    registerEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    disableEvent() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event) {
        cc.log("start--");
        var location = event.getLocation();
        this._preMovePos = location;
        this._isTouch = true;
    }

    _touchMoveTime: number;
    onTouchMove(event: cc.Event.EventTouch) {
        // let currentTime = Date.now();
        // // cc.log("disTime-->>", currentTime - this._touchMoveTime);
        // if (currentTime - this._touchMoveTime < 20) {
        //     // cc.log("太频繁了吧");
        // } else {
        //     this._touchMoveTime = currentTime;
        // }
        let pos = event.getLocation();
        let subVect = pos.sub(this._preMovePos);
        let radian = Math.atan2(subVect.x, subVect.y);
        let degrees = cc.misc.radiansToDegrees(radian);
        let disDegress = degrees - this._preDegress;
        if (Math.abs(disDegress) > 20) {
            this._isMove = true;
            if (disDegress > 0) {
                degrees = this._preDegress + 20;
            } else {
                degrees = this._preDegress - 20;
            }
        } else {
            // cc.log("disDegress--->>", disDegress);
            this._isMove = false;
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
        } else if (x < -20) {
            x = -20;
        }
        this.drill.x += x;
        this._preMovePos = pos;
    }
    onTouchEnd(event) {
        cc.log("end--");
        this._isTouch = false;
    }

    //点击开始游戏按钮
    onClickStartLab() {
        this.onClickStart(null, this);
    }

    //开始游戏
    onClickStart(obj: any, target: any) {
        let self = target as Helloworld;
        //统计
        GameManager.Statistics(Statistics.GAME_START);

        self.hideMainView();
        //新手引导
        cc.log("下沉深度--->>", self._currentDepth);
        //生成item
        //生成item可能造成卡顿
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
            let moveDownAct = cc.moveBy(2, cc.v2(self.drill.x, self.drill.y - self._currentDepth))//.easing(cc.easeOut(1.0));
            let seqDownAct = cc.sequence(moveDownAct, cc.callFunc(() => {
                self.runToTargetDownDepth();
            }))
            self.drill.runAction(seqDownAct);
        }))
        self.drill.runAction(seqAct);
    }

    _preMoveTime: number = 0;
    update(dt) {
        // cc.log(this._isMove);
        if (!this.drill) {
            return;
        }
        if (moveState.rotate === this._currentState || moveState.normal === this._currentState) {
            return;
        }
        //判断当前用户的操作
        // if (this._isMove) {
        //     let cTime = Date.now();
        //     if (cTime - this._preMoveTime > 200) {
        //         //变为
        //         this._isMove = false;
        //         this._preMoveTime = cTime;
        //     }
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

    drillDown(dt) {
        // cc.log('drillDown')
        // this.drill.y -= this.mSpeed * dt * 10;
        if (this.drill.y <= -300) {
            this.camera.node.y = this.drill.y;
        }
    }

    //下来到底部开始往上了
    runToTargetDownDepth() {
        this.drillClass.stopFlame();
        // cc.log("旋转")
        let rotateAct = cc.rotateBy(0.3, 180).easing(cc.easeIn(3.0));
        this._currentState = moveState.rotate;
        let seqAct = cc.sequence(rotateAct, cc.callFunc(() => {
            //判断新手引导
            if (this._gameManager.getGameGuide() == 0) {
                this.showGameGuide(1);
            }
            this._currentState = moveState.up;
            //碰撞组件开启
            this.drill.getComponent(cc.BoxCollider).enabled = true;
            //做拖尾效果
            this.drillClass.startMotionStreak();
            GameManager.audioManger.playBGM(this.loopAudio);
            this.registerEvent();
        }))
        this.drill.runAction(seqAct);
        GameManager.audioManger.playSFX(this.wheelAudio);
    }

    drillUp(dt) {
        this.drill.y += this.upSpeed * dt;
        if (this._isTouch) {
        } else {
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
        // cc.log('drillRocketUp')
        //关闭碰撞
        this.drill.getComponent(cc.BoxCollider).enabled = false;
        //取消监听
        this.disableEvent();
        // GameManager.audioManger.playBGM(this.rocketLoopAudio, 1);
        GameManager.audioManger.playBGM(this.drillup_audio);
        //运行动作
        let rotateAct = cc.rotateTo(0.2, 0);
        let moveAct = cc.moveTo(1.5, cc.v2(0, 0)).easing(cc.easeIn(3.0));
        let seqAct = cc.sequence(rotateAct, moveAct, cc.callFunc(() => {
            this._currentState = moveState.normal;
            this.camera.node.y = 0;
            this.completeGame();
        }));
        this.drill.runAction(seqAct);

        if (this.drill.y < 100) {
            this.camera.node.y = this.drill.y;
        }
    }

    drillRotate() {

    }

    drillNormal() {

    }

    //================================游戏开始和游戏结束后的处理=======================================================

    //随机生成道具
    randomCreateItem() {
        //根据深度和 解锁的钻头 生成 道具
        //共 60个 等级
        //共 20个格子
        //每升3个等级  升一个格子
        let count = Math.ceil(this._levelDpeth / 3) + 1;
        //60个等级
        let allVo = T_Unlock_Table.getAllVo();
        //格子数量
        // let count = Math.ceil((this._currentDepth - this.constNum) / 2 / 752);
        cc.log("共需生成-->>", (count + 1) * this.gridNumebrItem);
        for (let i = 0; i <= count; i++) {
            for (let j = 0; j < this.gridNumebrItem; j++) {
                let randx = Math.random() > 0.5 ? Math.random() * 320 : Math.random() * -320;
                let randy = Math.random() * 752;
                //格子改了 x2 深度也x2;
                let nodey = (i + 3) * 752 + randy;
                let pos = cc.v2(randx, -nodey);
                let inx = Math.floor(i / 2);
                if (inx == 0) { inx = 1; }
                if (inx > 10) { inx = 10; }
                // cc.log("inx---->>>", inx);
                let voItem = allVo[inx].value.split("_");
                // //随机0到3
                let index = Math.floor(Math.random() * 4);
                let itemId = Number(voItem[index]);

                //  1/5的概率是金色的
                let isGold = Math.random() * 10 <= 1;
                let item = LoadUtils.itemPool.get();
                if (!item) {
                    item = cc.instantiate(this.propItem);
                    // cc.log("重新生成item");
                }
                item.scale = 0.6;
                item.angle = 0;
                item.stopAllActions();
                item.getComponent(propItem_Component).init(itemId, isGold);
                item.position = pos;
                this.gameItemContent.addChild(item);
            }
        }

        //是否是渠道用户
        //计算是否产生 宝箱
        if (this._gameManager.getIsChannel() && this.getIsCreateRedPacket()) {
            cc.log("生成宝箱--");
            GameManager.Statistics(Statistics.LUCK_WALLET);
            if (this._gameManager.getGameGuide() === 0) { //第一次很容易勾到
                this.createRedPacketNode(true);
            } else {
                let flag = this.isEasyGet();
                cc.log("生成容易---->>", flag);
                this.createRedPacketNode(false, flag);
            }
        } else {
            cc.log("不生成宝箱--");
        }
    }

    //游戏完成
    completeGame() {
        this.drillClass.stopFlame();
        this.drillClass.stopTopAnim();
        this.drillClass.stopPuncture();
        this.drillClass.stopMotionStreak();
        //倾斜90度
        this.drillClass.popItemAnim();

        //游戏结束一次
        if (this._gameManager.getIsChannel()) {
            GameManager.endGameOne();
        }
        //弹出礼物界面
        let moveAct = cc.moveBy(0.2, cc.v2(this.drill.x, this.drill.y + 100));
        let moveAct2 = cc.moveTo(0.5, cc.v2(0, 0));
        let seqAct = cc.sequence(cc.spawn(moveAct, cc.callFunc(() => {
            //弹出礼物
            //从nodepool 中获取礼物, 抛洒动作
            this.resultAnim();
        })), moveAct2);
        this.drill.runAction(seqAct);

        GameManager.audioManger.playSFX(this.topAudio);
        GameManager.audioManger.playBGM(this.hallAudio);
        //弹出结果
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
            let x = Math.random() * 320;
            let y = GameUtil.getRandomNum(500, 1000);

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
            let bezierAct = cc.bezierBy(2, posArr);//.easing(cc.easeIn(3.0));
            let scaleAct = cc.scaleTo(2, 0.6);
            let seqAct = cc.sequence(cc.spawn(bezierAct, scaleAct), cc.callFunc(() => {
                item.getComponent(propItem_Component).hideMK();
                item.stopAllActions();
                item.scale = 0.6;
                item.removeFromParent();
                LoadUtils.itemPool.put(item);
            }));
            item.runAction(seqAct);
        }

        //开始弹出 特效动画
        let i = 0;
        let count = 0;
        this.schedule(() => {
            // for (let i = 0; i < this._collectList.length; i++) {
            let itemVo = this._collectList[i];
            let item = LoadUtils.itemPool.get();
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
                LoadUtils.itemPool.put(item);
            }))
            item.runAction(seqAct);

            //还有 label
            let itemLab = LoadUtils.labItemPool.get();
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

            cc.log("本次收集金币数-->>", count);
            // cc.log("本次收获新道具-->>", newItemList);
            // cc.log("本次收获新金色道具-->>", newGoldItemList);
            // cc.log("本次收获红包道具-->>", this.redPacketNodeList);
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
            //收集到红包没
            if (this.redPacketNodeList.length >= 1 && this._gameManager.getIsChannel()) {
                //隐藏红包
                for (let i = 0; i < this.redPacketNodeList.length; i++) {
                    const item = this.redPacketNodeList[i];
                    item.destroy();
                }
                //弹出红包
                this.showRedPacket();
                this.showScoreView(count, newItemList);
                this.showMainView();
                //隐藏积分面板
                this.hideHUDView();
                //判断是否需要展示新手引导
                this.showGuide();
            } else {
                this.showScoreView(count, newItemList);
                //隐藏积分面板
                this.hideHUDView();
                this.showMainView();
                //判断是否需要展示新手引导
                this.showGuide();
            }
            //重置状态
            this.resetGame();
        }, time);
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

        this.redPacketNodeList.length = 0;

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
                LoadUtils.itemPool.put(item);
                // item.destroy();
            }
        }

        for (let i = 0; i < this.gameItemContent.childrenCount; i++) {
            let gameItem = this.gameItemContent.children[i];
            if (gameItem && gameItem.group === "item") {
                gameItem.stopAllActions();
                gameItem.removeFromParent();
                LoadUtils.itemPool.put(gameItem);
            } else {
                cc.log("----------------------------");
                gameItem.removeFromParent();
                gameItem.destroy();
            }
        }
        this.gameItemContent.removeAllChildren();

        for (let i = 0; i < this.showItemContent.childrenCount; i++) {
            let item = this.showItemContent.children[i];
            if (item) {
                item.stopAllActions();
                item.removeFromParent();
                LoadUtils.itemPool.put(item);
            }
        }

        for (let i = 0; i < this.showLabItemContent.childrenCount; i++) {
            let item = this.showLabItemContent.children[i];
            if (item) {
                item.stopAllActions();
                item.removeFromParent();
                LoadUtils.labItemPool.put(item);
            }
        }
    }


    //=================================播放音乐=======================================================

    //收集金币
    playCollectMoneyAudio() {
        GameManager.audioManger.playSFX(this.moneyAudio);
    }

    //金色道具 audio
    playItemGoldAudio() {
        //item_goldAudio
        GameManager.audioManger.playSFX(this.itemGoldAudio);
    }
    //普通道具 audio
    playItemNormalAudio() {
        //item_normalAudio
        GameManager.audioManger.playSFX(this.itemNormalAudio);
    }

    //点击按钮音效
    clickBtnAudio() {
        //click_audio
        GameManager.audioManger.playSFX(this.clickAudip);
    }

    //关闭音效
    clickCloseAudio() {
        //close_audio
        GameManager.audioManger.playSFX(this.closeAudio);
    }

    //点击购买升级
    clickUpgradeAudio() {
        //Upgrade_audio
        GameManager.audioManger.playSFX(this.upgradeAudio);
    }


    //==================================Tool Method===========================================================
    //判断是否生成红包
    getIsCreateRedPacket(): boolean {
        if (GameManager.todayLookNum >= 6) {
            return false;
        }
        //拒绝的情况下  包括连点三局
        if (GameManager.otehrNum >= 1) {
            return false;
        }
        //有广告的情况下
        let hasAD = this._gameManager.getBufferFromJava();
        if (hasAD) {
            return true;
        } else {
            return false;
        }
    }

    //生成一个红包
    /**
     * @param isEasy  是否容易勾到
     */
    public createRedPacketNode(isFirst: boolean, isEasy: boolean = false) {
        //是否是渠道用户
        //计算是否产生 宝箱

        //redPackektItem
        let redPacket = cc.instantiate(this.redPackektItem);
        let pos1: cc.Vec2;
        if (isFirst) {  //第一次很容易勾到
            pos1 = cc.v2(0, -this._currentDepth + 752);
        } else {
            // -this._currentDepth + 752 正好是上方200处
            let randx = Math.random() > 0.5 ? Math.random() * 320 : Math.random() * -320;
            let randy;
            if (isEasy) {
                let dis = GameUtil.getRandomNum(752, 1128);
                randy = -this._currentDepth + dis;
            } else {
                let dis = GameUtil.getRandomNum(1504, 2256);
                randy = -this._currentDepth + dis;
                if (randy > this.targetDepth) {
                    randy = this.targetDepth + 200;
                }
            }
            pos1 = cc.v2(randx, randy);
        }
        //不容易够到
        // let pos2 = cc.v2(0, - this._currentDepth - 200);
        redPacket.position = pos1;
        cc.log("redpacketPos-->>", pos1);
        this.gameItemContent.addChild(redPacket);
    }

    //是否容易获得
    public isEasyGet() {
        if (GameManager.startNum == 1) {
            return false;
        } else {
            return true;
        }
        return true;
    }
}