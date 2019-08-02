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
