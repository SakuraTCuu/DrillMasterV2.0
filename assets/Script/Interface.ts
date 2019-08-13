

//===============================================================
/**
 * 检表工具,二分查找
    */
export class SerchUtil {
    public static binary_search(arr: Array<any>, serchKey: string, low: number, high: number, key: number): any {
        if (low > high) {
            return null;
        }
        var mid = Math.floor((high + low) / 2);
        if (mid >= arr.length) {
            return null;
        }
        if (arr[mid][serchKey] == key) {
            return arr[mid];
        } else if (arr[mid][serchKey] > key) {
            high = mid - 1;
            return SerchUtil.binary_search(arr, serchKey, low, high, key);
        } else if (arr[mid][serchKey] < key) {
            low = mid + 1;
            return SerchUtil.binary_search(arr, serchKey, low, high, key);
        }
    };
}

//========================================================================

export enum moveState {
    up,
    rocketup,
    down,
    touchEnd,
    rotate,
    normal,
}

//=================================
// {
//     "drill": 0,
//     "unlock": "1,2,3,4",
//     "sprite": {
//         "top": "0",
//         "mid": "1",
//         "down_back": "0",
//         "down_front": "0"
//     }
// }

export interface collectItemData {
    id: number;
    isGold: boolean;
}

export interface down_state {
    down_left: number;
    down_right: number;
}

export interface spriteData {
    top: number;
    mid: number;
    down_all: number; //一体的
    down_f: down_state; //只有前
    down_b: down_state; //只有后
}

export interface drillSpriteData {
    drill: number; //钻头id
    unlock: string; //解锁获得
    sprite: spriteData; //各部分图片id
}

export enum drillState {
    normal, //正常状态
    unlock, //已解锁的状态
    run, //正在使用的状态
}

export enum mainContentItemState {
    warehouse = 1,  //仓库
    depth = 2,    //深度
    outline = 3, //离线
}

export interface mainContenItemData {
    id: number;
    value: number;
    expend: number;
}

export enum saveName {
    TRUEMONEY = "trueMoney",
    USERCOUNT = "userCount",
    USERITEM = "userItem",
    USERGOLDITEM = "userGoldItem",
    UNLOCK = "unlock",
    WAREHOUSE = "warehouse",
    DEPTH = "depth",
    OUTLINE = "outline",
    PRETIME = "preTime",
    GAMEGUIDE = "gameGuide"
}


//========================================================
/**
 * 广播消息枚举类
 */
export enum NotifyEnum {
    CLICK_START,	//开始游戏
    CLICK_DRILL_ITEM, //点击中间的item
    UPDATEMONEY, //更新money
    UPDATEDEPTH,//更新深度
    UPDATEMAINITEM, //更新主界面下方的ui;
    GETITEMBYDRILL, //钻头碰撞获取到的道具
    CLICKCOLLECT, //点击离线/积分 面板的收集
    UNLOCKDRILL, //解锁mainview内的钻头
    UNLOCKBYITEM, //g根据解锁的道具来解锁钻头
    HIDEGAMEGUIDE, //隐藏引导节点
    CLICKREDPACKETCOLLECT, //点击 红包收集按钮
}

export enum ADTYPE {
    GOLD = 1,
    MONEY = 2
}
//======================================================
//升级 


//字符串
export enum STRING {
    mainContentItemName1 = "STORAGE",
    mainContentItemName2 = "DEPTH",
    mainContentItemName3 = "OFFLINE EARNINGS",
    setting = "SETTINGS",
    collection = "COLLECTION",
    double = "DOUBLE",
    claim = "CLAIM",
    great = "GREAT DIGGING!",
    guide1 = "UPGRADE DEPTH TO DRILL DEEPER!",
    guide2 = "UPGRADE STORAGE TO CARRY MORE TREASURE!",
    guide3 = "LET'S UPGRADE!",
    guide4 = "WHAT'S IN THE CHEST",
    newItem = "NEW TREASURE!"
}