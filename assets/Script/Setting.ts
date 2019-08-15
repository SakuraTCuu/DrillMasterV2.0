import GameManager from "./GameManager";
import Helloworld from "./Helloworld";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Setting extends cc.Component {

    @property(cc.Node)
    ball: cc.Node = null;

    @property(cc.Node)
    rectBg: cc.Node = null;

    @property(cc.Node)
    email: cc.Node = null;

    _currentState: boolean = true;

    onLoad() {
        if (GameManager.audioManger.bgmVolume > 0) {
            this._currentState = true;
        } else {
            this._currentState = false;
        }

        if (!this._currentState) {
            this.ball.x = this.rectBg.x + this.rectBg.width / 2 - this.ball.width / 2;
        } else {
            this.ball.x = this.rectBg.x - this.rectBg.width / 2 + this.ball.width / 2;
        }
    }

    onClickEmail() {
        //TODO
    }

    //服务条件
    onClickTermsOfService() {
        cc.sys.openURL("https://www.dropbox.com/s/x4z9o337knqi0no/Dig%20Dig%20Deeper%20Terms%20of%20Use.docx?dl=0");
        //点击 服务条件
        // if (cc.sys.os === cc.sys.OS_ANDROID) {
        //     jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showService", "()V");
        // } else {
        //     cc.log("only Android");
        // }
    }

    //隐私政策
    onClickPrivacyPolicy() {
        cc.sys.openURL("https://www.dropbox.com/s/o6cw0na751iwccg/Dig%20Dig%20Deeper%20%20Privacy.docx?dl=0");
        //点击服务条件
        // if (cc.sys.os === cc.sys.OS_ANDROID) {
        //     jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showPrivacyPolicy", "()V");
        // } else {
        //     cc.log("only Android");
        // }
    }

    onClickPlay() {
        this._currentState = !this._currentState;
        GameManager.audioManger.setBGMVolume(this._currentState ? 0.5 : 0);
        this.moveAction();
        cc.Canvas.instance.node.getComponent(Helloworld).clickBtnAudio();
    }

    onClickStop() {
        this._currentState = !this._currentState;
        GameManager.audioManger.setBGMVolume(this._currentState ? 0.5 : 0);
        this.moveAction();
        cc.Canvas.instance.node.getComponent(Helloworld).clickBtnAudio();
    }

    moveAction() {
        let rightPoint = this.rectBg.x + this.rectBg.width / 2 - this.ball.width / 2;
        let leftPoint = this.rectBg.x - this.rectBg.width / 2 + this.ball.width / 2;
        if (!this._currentState) {
            this.ball.runAction(cc.moveTo(0.5, cc.v2(rightPoint, this.ball.y)));
        } else {
            this.ball.runAction(cc.moveTo(0.5, cc.v2(leftPoint, this.ball.y)));
        }
    }

    onClickCloseBtn() {
        this.node.active = false;
        cc.Canvas.instance.node.getComponent(Helloworld).clickCloseAudio();
    }

}
