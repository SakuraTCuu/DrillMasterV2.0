import GameManager from "./GameManager";
import { T_Depth, T_Depth_Table } from "./Data/T_Depth";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapView extends cc.Component {


    @property(cc.Node)
    bg: cc.Node = null;

    //土
    @property(cc.SpriteFrame)
    dirt: cc.SpriteFrame = null;

    //晶石
    @property(cc.SpriteFrame)
    crystal: cc.SpriteFrame = null;

    //苔藓
    @property(cc.SpriteFrame)
    moss: cc.SpriteFrame = null;

    //火山
    @property(cc.SpriteFrame)
    lava: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    dirtToCrystal: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    crystalToMoss: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    mossToLava: cc.SpriteFrame = null;


    /**
     * 
     *  1280 *9024
     * 设定规则   y < 1000   土
     *           1000<y<2000 晶石
     *           2000<y<3000 苔藓
     *           3000<y<4000 火山 
     */

    onLoad() {

    }

    init(depth: number) {
        //深度
        let depthLevel = Number(GameManager.getInstance().getLevelDepth());
        // let depthVo = T_Depth_Table.getVoByKey(Number(depthLevel));
        // depthVo.depth;

        let height = depthLevel * 50;

    }

    start() {

    }
}
