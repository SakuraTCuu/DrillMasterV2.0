import GameManager from "../GameManager";
import Helloworld from "../Helloworld";
import LoadUtils from "../Util/LoadUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class showBoxItem_min_Component extends cc.Component {

    @property(cc.Sprite)
    itemSp: cc.Sprite = null;

    @property(cc.Node)
    normal: cc.Node = null;

    @property(cc.Node)
    gold: cc.Node = null;

    //设置数据
    setData(bgId: string) {

        let spriteAtlas =LoadUtils.itemSpriteAtlas;
        //是否有这个道具
        //是否有金色的道具
        let itemList = GameManager.getInstance().getItemList();
        let goldItemList = GameManager.getInstance().getGoldItemList();

        let isGold = false;
        let isHave = false;
        for (let i = 0; i < goldItemList.length; i++) {
            let id = goldItemList[i];
            if (bgId === id) {
                isGold = true;
            }
        }

        if (!isGold) {
            for (let i = 0; i < itemList.length; i++) {
                let id = itemList[i];
                if (bgId === id) {
                    isHave = true;
                }
            }
        }

        if (isGold) {
            //展示 金色的
            let bgPath = bgId + "_2";
            // cc.loader.loadRes(bgPath, cc.SpriteFrame, (err, spf: cc.SpriteFrame) => {
            //     if (!err) {
            //         this.itemSp.spriteFrame = spf;
            //     }
            //     // cc.log(err);
            // })
            let sp = spriteAtlas.getSpriteFrame(bgPath);
            this.itemSp.spriteFrame = sp;
            this.gold.active = true;
            this.normal.active = false;
            this.itemSp.node.color = cc.color().fromHEX("#FFFFFF");
        } else if (isHave) {
            //展示 普通的
            let bgPath = bgId + "_1";
            // cc.loader.loadRes(bgPath, cc.SpriteFrame, (err, spf: cc.SpriteFrame) => {
            //     if (!err) {
            //         this.itemSp.spriteFrame = spf;
            //     }
            //     // cc.log(err);
            // })
            let sp = spriteAtlas.getSpriteFrame(bgPath);
            this.itemSp.spriteFrame = sp;
            this.gold.active = false;
            this.normal.active = true;
            this.itemSp.node.color = cc.color().fromHEX("#FFFFFF");
        } else {
            //展示 未获得的
            let bgPath = bgId + "_0";
            // cc.loader.loadRes(bgPath, cc.SpriteFrame, (err, spf: cc.SpriteFrame) => {
            //     if (!err) {
            //         this.itemSp.spriteFrame = spf;
            //     }
            //     // cc.log(err);
            // })
            let sp = spriteAtlas.getSpriteFrame(bgPath);
            this.itemSp.spriteFrame = sp;
            this.gold.active = false;
            this.normal.active = true;
            this.itemSp.node.color = cc.color().fromHEX("#933728");
        }
    }
}
