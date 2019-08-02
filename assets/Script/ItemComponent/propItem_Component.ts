const { ccclass, property } = cc._decorator;

@ccclass
export default class propItem_Component extends cc.Component {

    @property(cc.Sprite)
    normalSp: cc.Sprite = null;

    id: number = 0;
    isGold: boolean = false;

    init(id: number, isGold: boolean) {
        this.id = id;
        this.isGold = isGold;
        let path = "item/" + id;
        if (isGold) {
            path += "_2";
        } else {
            path += "_1";
        }
        cc.loader.loadRes(path, cc.SpriteFrame, (err, spf: cc.SpriteFrame) => {
            if (!err) {
                this.normalSp.spriteFrame = spf;
            }
            // cc.log('err-->>', err);
        })
    }

    /**
 * 当碰撞产生的时候调用
 * @param  {Collider} other 产生碰撞的另一个碰撞组件
 * @param  {Collider} self  产生碰撞的自身的碰撞组件
 */
    // onCollisionEnter(other: cc.BoxCollider, self: cc.BoxCollider) {
    //     // console.log('on collision enter');
    //     // self.node.destroy();
    // }
}
