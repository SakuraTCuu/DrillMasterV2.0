import GameManager from "../GameManager";
import { T_Unlock_Table } from "../Data/T_unlock";
import { T_Item } from "../Data/T_Item";

export default class GameUtil {

    //获取第一个红包的随机数额
    public static getFirstRedPacket() {
        let result = GameUtil.getRandomNum(1, 1.3);
        return result;
    }

    //随机 一个 红包  计算概率
    public static calcRedPacket(): number {
        let MaxPlayerMoney = 50;
        let money = GameManager.getInstance().getTrueMoney();

        let result: number;
        if (money >= 49.55) {
            result = 0.00;
        } else if (money < 20) {
            if (GameUtil.getRandomNum(1, 4) % 3 == 0) {
                result = GameUtil.getRandomNum(0.6, 1);
            } else {
                result = GameUtil.getRandomNum(1, 2.8);
            }
        } else if (money > 47) {
            result = GameUtil.getRandomNum(0.1, 0.4);
            // result = GameUtil.getRandomNum(result, 2);
        } else {
            result = ((MaxPlayerMoney - money) / MaxPlayerMoney) * GameUtil.getRandomNum(1, 1.5);
        }

        if (result < 0.01) {
            result = GameUtil.getRandomNum(0.05, 0.15);
        }

        result = Number(result.toFixed(2));
        //返回结果
        return result;
    }

    /**
     * 限定范围内的随机数
     */
    public static getRandomNum(Min: number, Max: number): number {
        var Range = Max - Min;
        var Rand = Math.random();
        var num = Min + Rand * Range; //四舍五入
        num = Number(num.toFixed(2));
        return num;
    }

    public static sortArr(list: Array<string>) {
        // let newArr = new Array();
        for (let i = 0; i < list.length; i++) {
            for (let j = i + 1; j < list.length; j++) {
                if (Number(list[i]) > Number(list[j])) {
                    let temp = list[i];
                    list[i] = list[j];
                    list[j] = temp;
                }
            }
        }
        // cc.log("list-->>", list);
    }

    /**
     * 数组去重
     * @param list 
     */
    public static deleteWeight(list: Array<T_Item>): Array<T_Item> {
        let newArr = new Array();
        for (let i = 0; i < list.length; i++) {
            let flag = false;
            for (let j = i + 1; j < list.length; j++) {
                let item1 = list[i];
                let item2 = list[j];
                if (item1.id === item2.id) {
                    flag = true;
                }
            }
            if (!flag) {
                newArr.push(list[i]);
            }
        }
        return newArr;
    }

    /**
     * 获取当前钻头是否已经解锁
     * @param id  钻头id
     */
    public static getIsUnlock(id: number): boolean {
        let unLockList = GameManager.getInstance().getUnlockList();
        for (let i = 0; i < unLockList.length; i++) {
            let temp = unLockList[i];
            if (id === Number(temp)) {
                return true;
            }
        }
        return false;
    }

    //是否拥有某个道具?
    public static getItemIsHave(id: number) {
        let itemList = GameManager.getInstance().getItemList();
        for (let i = 0; i < itemList.length; i++) {
            let item = itemList[i];
            if (id === Number(item)) {
                return true;
            }
        }
        return false;
    }

    //是否拥有某个金色道具?
    public static getGoldItemIsHave(id: number) {
        let itemList = GameManager.getInstance().getGoldItemList();
        for (let i = 0; i < itemList.length; i++) {
            let item = itemList[i];
            if (id === Number(item)) {
                return true;
            }
        }
        return false;
    }

    //是否可以解锁下一个钻头
    public static isCanUnlockDrill(id: number) {
        let unlockTable = T_Unlock_Table.getAllVo();
        if (id >= unlockTable.length) {
            return false;
        }
        const unlockVo = unlockTable[id];
        let itemListVo = unlockVo.value.split("_");

        let userItemList = GameManager.getInstance().getItemList();

        for (let i = 0; i < itemListVo.length; i++) {
            let flag2 = false;
            let item = itemListVo[i];
            for (let j = 0; j < userItemList.length; j++) {
                let element = userItemList[j];
                if (Number(item) === Number(element)) {
                    flag2 = true;
                }
            }
            if (!flag2) {
                return false;
            }
        }
        return true;
    }

    /** 根据深度等级返回道具 */
    public static getItemByDepth(depth: number) {
        // 1-4  返回两种道具
        //5-
        if (depth >= 1 && depth <= 4) {
            return "1_2";
        }
    }
}
