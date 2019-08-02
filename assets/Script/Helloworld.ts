import { moveState, NotifyEnum, mainContenItemData, collectItemData } from "./Interface";
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
import { T_Item_Table } from "./Data/T_Item";

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

    @property(cc.Camera)
    camera: cc.Camera = null;

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

    //收集到的道具数量
    _itemNumber: number = 0;
    _levelDpeth: number = 0;
    _levelWarehouse: number = 0;
    _collectList: Array<collectItemData> = new Array();
    constNum: number = 3008;
    _currentDepth: number = 0;

    onLoad() {
        //开启碰撞
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;

        this._gameManager = GameManager.getInstance();
        this.initView();
        this.initGame();
        this.initAudio();
        _Notification_.subscrib(NotifyEnum.CLICK_START, this.onClickStart, this);
        _Notification_.subscrib(NotifyEnum.UPDATEMONEY, this.updateMoneyLab, this);
        _Notification_.subscrib(NotifyEnum.UPDATEMAINITEM, this.updateMainUI, this);
        _Notification_.subscrib(NotifyEnum.GETITEMBYDRILL, this.getItemByDrill, this);
    }

    start() {
        //初始化节点池
        this.nodePool = new cc.NodePool();
        let itemList = T_Item_Table.getAllVo();
        let i = 0;
        this.schedule(() => {
            let item = cc.instantiate(this.propItem);
            let isGold = Math.random() * 10 <= 2;
            item.getComponent(propItem_Component).init(itemList[i].id, isGold);
            this.nodePool.put(item);
            i++;
        }, 0.017, itemList.length - 1, 0);
    }

    onDestroy() {
        _Notification_.unsubscrib(NotifyEnum.CLICK_START, this.onClickStart);
        _Notification_.unsubscrib(NotifyEnum.UPDATEMONEY, this.updateMoneyLab);
    }

    initView() {
        this._mainView = this.mainNode.getChildByName("mainView");
        this._mainDrill = this.mCanvas.getChildByName("drill_main");
        this._mainDownBackView = this.mainNode.getChildByName("main_back");
        this._mainDownFrontView = this.mainNode.getChildByName("main_front");

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
            warehouseVo = T_Warehouse_Table.getVoByKey(Number(warehouse) + 1);
        }

        if (this._gameManager.getDepthIsTop()) {
            depthVo = T_Depth_Table.getVoByKey(Number(depth));
        } else {
            depthVo = T_Depth_Table.getVoByKey(Number(depth) + 1);
        }

        if (this._gameManager.getOutlineIsTop()) {
            outlineVo = T_OutLine_Table.getVoByKey(Number(outline));
        } else {
            outlineVo = T_OutLine_Table.getVoByKey(Number(outline) + 1);
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
        let self = target;
        //初始化界面钱数
        self.moneyLab.string = "$" + self._gameManager.getUserCount();
        self.updateMainUI("", self);
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

    //结果分数面板
    showScoreView(score: number) {
        this.offLineUI.active = true;
        this.offLineUI.getComponent(OfflineView).showScore(score);
    }

    hideScoreView() {
        this.offLineUI.active = false;
    }

    showMainView() {
        this.mainNode.active = true;
        this.setting.active = true;
        this._mainDrill.active = false;
    }

    //设置ui状态
    hideMainView() {
        //隐藏
        this.mainNode.active = false;
        this.setting.active = false;
        this._mainDrill.active = true;
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
    }

    onTouchMove(event: cc.Event.EventTouch) {
        let pos = event.getLocation();

        let subVect = pos.sub(this._preMovePos);
        let radian = Math.atan2(subVect.x, subVect.y);
        let degrees = cc.misc.radiansToDegrees(radian);
        let disDegress = degrees - this._preDegress;
        if (Math.abs(disDegress) > 5) {
            if (disDegress > 0) {
                degrees = this._preDegress + 5;
            } else {
                degrees = this._preDegress - 5;
            }
        }
        if (degrees > 70) {
            degrees = 70;
        }
        if (degrees < -70) {
            degrees = - 70;
        }
        this.drill.angle = -degrees;
        this._preDegress = degrees;
        let x = (pos.x - this._preMovePos.x); //* Math.abs(Math.sin(cc.misc.degreesToRadians(degrees)));
        if (x > 20) {
            // cc.log('x--->>', x);
            x = 20;
        }
        this.drill.x += x;
        this._preMovePos = pos;
    }
    onTouchEnd(event) {
        cc.log("end--");
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

        //获取当前下潜深度
        self._levelDpeth = Number(self._gameManager.getLevelDepth());

        self._levelWarehouse = Number(self._gameManager.getLevelWarehouse());
        //需要生成item占用 格子的数量
        // let gridNumber = (levelDpeth * self.perLevelDis) / 752;
        // self._currentDepth = gridNumber * 2 * 752;
        self._currentDepth = self.constNum + self._levelDpeth * self.perLevelDis * 2;

        cc.log("下沉深度--->>", self._currentDepth);
        //生成item
        self.randomCreateItem();

        self.showHUDView();
        self.updateHUDView(0, self._levelWarehouse);

        self.drill = self._mainView.getComponent(MainView).getItemNode();
        self.drill.setPosition(cc.v2(0, 80));
        self.drill.getComponent(Item_Component).startRun();
        self.drill.getComponent(cc.BoxCollider).enabled = false;
        self._mainDrill.addChild(self.drill);

        let moveAct = cc.moveBy(0.3, cc.v2(self.drill.x, self.drill.y + 100));
        let rotateAct = cc.rotateBy(0.3, -180);
        self._currentState = moveState.rotate;
        let moveAct2 = cc.moveBy(0.2, cc.v2(self.drill.x, self.drill.y - 100));
        let spawnAct2 = cc.spawn(moveAct2, cc.callFunc(() => {
            let drillClass = self.drill.getComponent(Item_Component);
            //粒子效果
            drillClass.particle.node.active = true;
            //火焰喷射效果
            drillClass.startFlame();
            //钻头效果
            drillClass.startTopAnim();
            //开启音效
            GameManager.audioManger.stopBGM();
            let id = GameManager.audioManger.playSFX(self.startAudio);
            // GameManager.audioManger.playSFX(self.startAudio2);
            // 第二个音效
            // cc.audioEngine.setFinishCallback(id, () => {
            //     // GameManager.audioManger.playSFX(self.startAudio3);
            // });
        }));
        let seqAct = cc.sequence(cc.sequence(moveAct, rotateAct), spawnAct2, cc.callFunc(() => {
            self._currentState = moveState.down;
            //动作下去
            let moveDownAct = cc.moveBy(1, cc.v2(self.drill.x, self.drill.y - self._currentDepth)).easing(cc.easeOut(1.0));
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
                this.camera.node.y = this.drill.y + 300;
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
        //设置状态
        this._currentState = moveState.rocketup;

        this.drillRocketUp();
    }

    runToTargetDownDepth() {
        this.drill.getComponent(Item_Component).stopFlame();
        cc.log("旋转")
        let rotateAct = cc.rotateBy(0.3, 180).easing(cc.easeIn(3.0));
        this._currentState = moveState.rotate;
        let seqAct = cc.sequence(rotateAct, cc.callFunc(() => {
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
        this.drill.getChildByName("mk").getComponent(cc.MotionStreak).enabled = true;
        GameManager.audioManger.playBGM(this.loopAudio, 0.2);
        // cc.audioEngine.play(this.loopAudio, true, 0.1);

        this.registerEvent();
        this.drill.y += this.upSpeed * dt;
        if (this.drill.angle >= 1) {
            this.drill.angle -= 1;
        } else if (this.drill.angle <= -1) {
            this.drill.angle += 1;
        } else {
            this.drill.angle = 0;
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

        //取消监听
        this.disableEvent();
        GameManager.audioManger.playBGM(this.rocketLoopAudio, 1);
        //运行动作
        let rotateAct = cc.rotateTo(0.2, 0);
        let moveAct = cc.moveTo(1.0, cc.v2(0, 0)).easing(cc.easeIn(3.0));
        let seqAct = cc.sequence(rotateAct, moveAct, cc.callFunc(() => {
            this.completeGame();
        }));
        this.drill.runAction(seqAct);
        this.camera.node.y = this.drill.y;
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
        let unlockList = this._gameManager.getUnlockList();

        //用解锁的钻头来对应深度和道具
        //1个钻头表示一个格子 750
        //一个格子里  生成10个
        //格子1  生成钻头1 的道具
        //11个 格子  
        let maxId = Number(unlockList[unlockList.length - 1]);
        let unlockVo = T_Unlock_Table.getVoByKey(maxId);

        let allVo = T_Unlock_Table.getAllVo();

        //格子数量
        let count = Math.ceil((this._currentDepth - this.constNum) / 2 / 752);
        for (let i = 1; i <= count; i++) {
            for (let j = 0; j < this.gridNumebrItem; j++) {
                let randx = Math.random() > 0.5 ? Math.random() * 320 : Math.random() * -320;
                let randy = Math.random() * 1504;
                //格子改了 x2 深度也x2;
                let nodey = (i + 1) * 1504 - (1504 - randy);
                let pos = cc.v2(randx, -nodey);
                let voItem = allVo[i].value.split("_");
                //随机0到3
                let index = Math.floor(Math.random() * 4);
                let itemId = Number(voItem[index]);

                //  1/5的概率是金色的
                let isGold = Math.random() * 10 <= 2;

                let item = this.nodePool.get();
                if (!item) {
                    item = cc.instantiate(this.propItem)
                } else {
                    cc.log("重新生成item");
                }
                item.getComponent(propItem_Component).init(itemId, isGold);
                // cc.log('pos-->>', pos);
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
        self.updateHUDView(self._itemNumber, self._levelWarehouse);
        //判断是否收集够了
        if (self._itemNumber >= self._levelWarehouse) {
            //收集够了 ,开始加速上升
            self.runToTargetUpDepth();
            //关闭碰撞
            self.drill.getComponent(cc.BoxCollider).enabled = false;
        }
    }

    //游戏完成
    completeGame() {
        this._currentState = moveState.normal;
        this.drill.getComponent(Item_Component).stopTopAnim();
        GameManager.audioManger.playSFX(this.topAudio);
        GameManager.audioManger.playBGM(this.hallAudio);

        cc.log(this._collectList);
        //结算动画
        this.resultAnim();
        //弹出结果

        //检测解锁钻头
        //重置界面
        //等待下一次开始
        // this.showMainView();
        //隐藏积分面板
        this.hideHUDView();
        this.drill.destroy();
    }

    //结算动画
    resultAnim() {
        //
    }

    //展示结果界面
    showResultView() {

    }

    //隐藏结果界面
    hideResultView() {

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