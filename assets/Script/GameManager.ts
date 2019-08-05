import { saveName, NotifyEnum } from "./Interface";
import { _Notification_ } from "./_Notification_";
import AudioManager from "./AudioManager";
import { T_OutLine_Table } from "./Data/T_OutLine";
import Helloworld from "./Helloworld";
import GameUtil from "./Util/GameUtil";
import { T_Unlock_Table } from "./Data/T_unlock";
import OfflineView from "./OfflineView";

export default class GameManager {

    public static audioManger: AudioManager = null;

    private _itemList: Array<string> = null;
    private _glodItemList: Array<string> = null;
    private _unlockList: Array<string> = null;
    private _disTime: number = 0;

    private _userCount: string = "";
    private _warehouse: string = "";
    private _depth: string = "";
    private _outline: string = "";


    _preShowTime: number = 0;
    private static instance: GameManager = null;

    public static getInstance(): GameManager {
        if (!this.instance) {
            cc.log('instance');
            this.instance = new GameManager();
            this.instance.init();
            this.audioManger = new AudioManager();
        }
        return this.instance;
    }

    //进入游戏初始化
    //获取保存的数据
    //没有的话就按第一次处理,设置默认值
    //有的话就获取
    public init() {
        //玩家的钱数
        const userCount: string = cc.sys.localStorage.getItem("userCount");
        //解锁的道具
        const userItem: string = cc.sys.localStorage.getItem("userItem");
        //解锁的金色道具
        const userGoldItem: string = cc.sys.localStorage.getItem("userGoldItem");
        //玩家已解锁钻头
        // const unlock: string = cc.sys.localStorage.getItem("unlock");
        //玩家的各个等级
        const warehouse: string = cc.sys.localStorage.getItem("warehouse");
        const depth: string = cc.sys.localStorage.getItem("depth");
        const outline: string = cc.sys.localStorage.getItem("outline");
        //上次登录时间
        const preTime: number = cc.sys.localStorage.getItem("preTime");

        if (userCount && Number(userCount) && userCount !== "NaN") {
            this._userCount = userCount;
        } else {
            this._userCount = "500";
            this.saveData(saveName.USERCOUNT, this._userCount);
        }

        //拥有的道具
        if (userItem) {
            this._itemList = userItem.split("_");
        } else {
            this._itemList = new Array();
            //Test
            this._itemList.push();
            this.saveData(saveName.USERITEM, "");
        }

        this._unlockList = new Array();
        // 钻头根据道具来解锁
        this.getUnlockListFromItemList();

        if (userGoldItem) {
            this._glodItemList = userGoldItem.split("_");
        } else {
            this._glodItemList = new Array();
            //Test
            this._glodItemList.push();
            this.saveData(saveName.USERGOLDITEM, "");
        }

        //拥有的钻头
        // if (unlock) {
        //     //拥有的道具
        //     this._unlockList = unlock.split("_");
        // } else {
        //     // this._unlockList = new Array();
        //     // this.saveData(saveName.UNLOCK, "");
        //     this._unlockList = this.getUnlockListFromItemList();
        // }

        if (warehouse) {
            this._warehouse = warehouse;
        } else {
            this._warehouse = "1";
            this.saveData(saveName.WAREHOUSE, this._warehouse);
        }

        if (depth) {
            this._depth = depth;
        } else {
            this._depth = "1";
            this.saveData(saveName.DEPTH, this._depth);
        }

        if (outline) {
            this._outline = outline;
        } else {
            this._outline = "1";
            this.saveData(saveName.OUTLINE, this._outline);
        }

        //离线时间
        if (preTime) {
            let currentTime = Date.now();
            this._disTime = currentTime - preTime;
        } else {
            //无收益
            this._disTime = 0;
            // this.saveData(saveName.PRETIME, Date.now());
        }

        //全局监听进入后台事件
        cc.game.on(cc.game.EVENT_HIDE, () => {
            cc.log('hide');
            this._preShowTime = Date.now();
            //进入后台直接写
            this.saveData(saveName.PRETIME, this._preShowTime);
        }, this)

        cc.game.on(cc.game.EVENT_SHOW, () => {
            cc.log('show');
            let cTime = Date.now();
            this._disTime = cTime - this._preShowTime;
            if (this.getOfflineIncome() > 0) {
                //弹出收益框
                let hw = cc.Canvas.instance.node.getComponent(Helloworld);
                hw.offLineUI.active = true;
                hw.offLineUI.getComponent(OfflineView).showOffline();
            }
        }, this)
    }

    //监听安卓原生退出游戏
    public static addExitEvent(): void {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            let preTime = 0;
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, (event) => {
                switch (event.keyCode) {
                    //注意Creator版本为2.x的请把cc.KEY.back。修改成cc.macro.KEY.back
                    case cc.macro.KEY.back:
                        let cTime = Date.now();
                        if (cTime - preTime < 200) {
                            this.instance.saveData(saveName.PRETIME, cTime);
                            cc.director.end();
                            return;
                        }
                        preTime = cTime
                        break;
                }
            }, this);
        }
    }

    //保存数据
    public saveData(key: saveName, value: any) {
        //更新value
        switch (key) {
            case saveName.WAREHOUSE:
                value = Number(value) + "";
                this._warehouse = value;
                break;
            case saveName.DEPTH:
                value = Number(value) + "";
                this._depth = value;
                _Notification_.send(NotifyEnum.UPDATEDEPTH);
                break;
            case saveName.OUTLINE:
                value = Number(value) + "";
                this._outline = value;
                break;
            case saveName.USERCOUNT:
                value = Number(value) + "";
                this._userCount = value;
                _Notification_.send(NotifyEnum.UPDATEMONEY);
                break;
            case saveName.UNLOCK:  //TODO  拼接字符串
                value = Number(value) + "";
                //先查重
                let f3 = true;
                for (let i = 0; i < this._unlockList.length; i++) {
                    let id = this._unlockList[i];
                    if (Number(id) === Number(value)) {
                        //不存在
                        f3 = false;
                    }
                }
                if (!f3) {
                    return;
                }
                //说明有新解锁的了
                _Notification_.send(NotifyEnum.UNLOCKBYITEM, value);
                this._unlockList.push(value);
                //排序
                GameUtil.sortArr(this._unlockList);
                //不写入
                return;
                //写入
                value = ""
                for (let i = 0; i < this._unlockList.length; i++) {
                    let str = this._unlockList[i];
                    value += str;
                    if (i !== this._unlockList.length - 1) {
                        value += "_";
                    }
                }
                break;
            case saveName.USERITEM:  //TODO 拼接字符串
                value = Number(value) + "";
                //先查重
                let flag = true;
                for (let i = 0; i < this._itemList.length; i++) {
                    let id = this._itemList[i];
                    if (Number(id) === Number(value)) {
                        //不存在
                        flag = false;
                    }
                }
                if (!flag) {
                    return;
                }
                this._itemList.push(value);
                //排序
                GameUtil.sortArr(this._itemList);
                cc.log("排序后-->>", this._itemList);
                //写入
                value = ""
                for (let i = 0; i < this._itemList.length; i++) {
                    let str = this._itemList[i];
                    value += str;
                    if (i !== this._itemList.length - 1) {
                        value += "_";
                    }
                }
                break;
            case saveName.USERGOLDITEM:  //TODO 拼接字符串
                value = Number(value) + "";
                //先查重
                let f = true;
                for (let i = 0; i < this._glodItemList.length; i++) {
                    let id = this._glodItemList[i];
                    if (Number(id) === Number(value)) {
                        //存在
                        f = false;
                    }
                }
                if (!f) {
                    return;
                }
                this._glodItemList.push(value);
                //排序
                GameUtil.sortArr(this._glodItemList);
                //写入
                value = ""
                for (let i = 0; i < this._glodItemList.length; i++) {
                    let str = this._glodItemList[i];
                    value += str;
                    if (i !== this._glodItemList.length - 1) {
                        value += "_";
                    }
                }
                break;
            case saveName.PRETIME:    //TODO  什么时间保存?
                // this._disTime = value;
                break;
        }
        cc.log("key-->>", key);
        cc.log("value-->>", value);
        cc.sys.localStorage.setItem(key, value);
    }

    /**
     * 
     */
    public getItemList(): Array<string> {
        return this._itemList;
    }

    public getUnlockList(): Array<string> {
        return this._unlockList;
    }

    public getDisTime(): number {
        return this._disTime;
    }

    public getUserCount(): string {
        return this._userCount;
    }

    public getLevelWarehouse(): string {
        return this._warehouse;
    }

    public getLevelDepth(): string {
        return this._depth;
    }

    public getLevelOutline(): string {
        return this._outline;
    }

    public getGoldItemList(): Array<string> {
        return this._glodItemList;
    }

    public getWarehouseIsTop(): boolean {
        return Number(this._warehouse) == 45;
    }

    public getDepthIsTop(): boolean {
        return Number(this._depth) == 68;
    }

    public getOutlineIsTop(): boolean {
        return Number(this._outline) == 68;
    }

    public getOfflineIncome(): number {
        let income: number;
        if (this._disTime !== 0) {
            //毫秒数,需要转换
            let outlineMinutes = Math.floor(this._disTime / 1000 / 60);
            let level = Number(this.getLevelOutline());
            let outline = T_OutLine_Table.getVoByKey(level);
            income = outline.income * outlineMinutes; //总收益
        } else {
            income = 0;
        }
        return income;
    }

    //从道具列表获取解锁钻头
    getUnlockListFromItemList() {
        this._unlockList.length = 0;
        let allVo = T_Unlock_Table.getAllVo();
        for (let i = 0; i < allVo.length; i++) {
            let list = allVo[i].value.split("_");
            let flag = true;
            for (let j = 0; j < list.length; j++) {
                let id = Number(list[j]);
                if (!GameUtil.getItemIsHave(id)) {
                    flag = false;
                }
            }
            if (flag) {
                this._unlockList.push(allVo[i].id + "");
            }
        }
        cc.log("钻头list-->", this._unlockList);
    }
}
