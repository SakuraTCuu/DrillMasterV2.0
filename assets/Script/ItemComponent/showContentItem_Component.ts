import Helloworld from "../Helloworld";

const { ccclass, property } = cc._decorator;

@ccclass
export default class showContentItem_Component extends cc.Component {

    @property(cc.Sprite)
    itemSprit: cc.Sprite = null;

    //初始化图片
    initSprite(path: string, flag: number) {
        // cc.log("path==>>", path);

        let spriteAtlas = cc.Canvas.instance.node.getComponent(Helloworld).itemSpriteAtlas;
        //展示图片
        // cc.loader.loadRes("item/" + path, cc.SpriteFrame, (err, spf: cc.SpriteFrame) => {
        //     if (!err) {
        //         this.itemSprit.spriteFrame = spf;
        //     }
        //     if (flag === 0) {
        //         this.itemSprit.node.color = cc.color(255, 255, 255, 255);
        //     }
        //     // cc.log("err-->>", err);
        // })

        let sp = spriteAtlas.getSpriteFrame(path);
        this.itemSprit.spriteFrame = sp;
        if (flag === 0) {
            this.itemSprit.node.color = cc.color(255, 255, 255, 255);
        }
    }
}
