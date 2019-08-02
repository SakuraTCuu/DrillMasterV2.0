const { ccclass, property } = cc._decorator;

@ccclass
export default class showContentItem_Component extends cc.Component {

    @property(cc.Sprite)
    itemSprit: cc.Sprite = null;

    //初始化图片
    initSprite(path: string, flag: number) {
        // cc.log("path==>>", path);
        //展示图片
        cc.loader.loadRes("item/" + path, cc.SpriteFrame, (err, spf: cc.SpriteFrame) => {
            if (!err) {
                this.itemSprit.spriteFrame = spf;
            }
            if (flag === 0) {
                this.itemSprit.node.color = cc.color(255, 255, 255, 255);
            }
            // cc.log("err-->>", err);
        })

        //有的图片是解锁了的 需要特殊处理
    }
}
