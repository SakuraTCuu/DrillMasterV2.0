import GameManager from "../GameManager";
import { T_Unlock_Table } from "../Data/T_unlock";
import { T_Item } from "../Data/T_Item";

export default class GameUtil {

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

}
