const { ccclass, property } = cc._decorator;

@ccclass
export default class GuideOverView extends cc.Component {

    @property(cc.SpriteFrame)
    star_normal: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    star_gray: cc.SpriteFrame = null;

    @property(cc.Node)
    notBtn: cc.Node = null;

    @property(cc.Node)
    submitBtn: cc.Node = null;

    @property(cc.Node)
    starContent: cc.Node = null;

    _clickId: number = 0;
    onLoad() {
        this.notBtn.on(cc.Node.EventType.TOUCH_END, this.clickNotBtn, this)
        this.submitBtn.on(cc.Node.EventType.TOUCH_END, this.clickSubmitBtn, this)
    }

    onClickStar(event, data) {
        let star1 = this.starContent.getChildByName("star1");
        let star2 = this.starContent.getChildByName("star2");
        let star3 = this.starContent.getChildByName("star3");
        let star4 = this.starContent.getChildByName("star4");
        let star5 = this.starContent.getChildByName("star5");

        this._clickId = Number(data);
        this.submitBtn.opacity = 200;

        switch (data) {
            case "5":
                star5.getComponent(cc.Sprite).spriteFrame = this.star_normal;
            case "4":
                star4.getComponent(cc.Sprite).spriteFrame = this.star_normal;
            case "3":
                star3.getComponent(cc.Sprite).spriteFrame = this.star_normal;
            case "2":
                star2.getComponent(cc.Sprite).spriteFrame = this.star_normal;
            case "1":
                star1.getComponent(cc.Sprite).spriteFrame = this.star_normal;
        }

        switch (data) {
            case "1":
                star2.getComponent(cc.Sprite).spriteFrame = this.star_gray;
            case "2":
                star3.getComponent(cc.Sprite).spriteFrame = this.star_gray;
            case "3":
                star4.getComponent(cc.Sprite).spriteFrame = this.star_gray;
            case "4":
                star5.getComponent(cc.Sprite).spriteFrame = this.star_gray;
            // case "5":
            //     star5.getComponent(cc.Sprite).spriteFrame = this.star_gray;
        }
        if (data == "5") {
            star5.getComponent(cc.Sprite).spriteFrame = this.star_normal;
        }
    }

    clickNotBtn() {
        this.node.active = false;
    }

    clickSubmitBtn() {
        //判断是否评分了
        if (this._clickId !== 0) {
            //打开评论界面
            cc.sys.openURL("https://play.google.com/store/apps/details?id=com.digger.miner");
        } else {
            //无响应
        }
        this.node.active = false;
    }
}
