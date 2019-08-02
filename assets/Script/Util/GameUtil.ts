import GameManager from "../GameManager";

export default class GameUtil {

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

}
