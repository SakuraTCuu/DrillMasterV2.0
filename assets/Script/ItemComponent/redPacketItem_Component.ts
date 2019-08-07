import Helloworld from "../Helloworld";

const { ccclass, property } = cc._decorator;

@ccclass
export default class redPacketItem_Component extends cc.Component {

    // @property(cc.Label)
    // label: cc.Label = null;

    // @property
    // text: string = 'hello';

    /**
* 当碰撞产生的时候调用
* @param  {Collider} other 产生碰撞的另一个碰撞组件
* @param  {Collider} self  产生碰撞的自身的碰撞组件
*/
    onCollisionEnter(other: cc.BoxCollider, self: cc.BoxCollider) {
        // console.log('on collision enter');
        // self.node.destroy();
        //展示金钱动画
        // let hw = cc.Canvas.instance.node.getComponent(Helloworld);

        //收获红包了
        
    }
}
