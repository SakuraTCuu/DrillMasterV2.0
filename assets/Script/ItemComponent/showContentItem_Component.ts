import Helloworld from "../Helloworld";
import LoadUtils from "../Util/LoadUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class showContentItem_Component extends cc.Component {

    @property(cc.Sprite)
    itemSprit: cc.Sprite = null;

    //初始化图片
    initSprite(path: string, flag: number) {
        let sp = LoadUtils.itemSpriteAtlas.getSpriteFrame(path);
        this.itemSprit.spriteFrame = sp;
        if (flag === 0) {
            this.itemSprit.node.color = cc.color(255, 255, 255, 255);
        }
    }
}
