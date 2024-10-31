import LoadUtils from "../Util/LoadUtils";
import propItem_Component from "../ItemComponent/propItem_Component";
import { T_Item_Table } from "../Data/T_Item";
import GameManager from "../GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Loading extends cc.Component {

    @property(cc.Label)
    LoadLab: cc.Label = null;

    @property({
        type: cc.AudioClip,
        displayName: "加载音效"
    })
    loadAudio: cc.AudioClip = null;

    start() {
        // cc.game.setFrameRate(48);
        //开启碰撞
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;

        //初始化管理类
        GameManager.getInstance();
        LoadUtils.init();
        GameManager.audioManger.playBGM(this.loadAudio);
        // this.LoadLab.string = "loading...";
        cc['startGame'] = this.startGame.bind(this);
        //开始加载资源
        //加载图集资源
        //加载图片
        //加载item
        //加载图集资源
        // LoadUtils.loadResDir("item", () => {
        //     //cc.log("图集资源加载完成")
        // });

        //开始预加载场景资源
        cc.director.preloadScene("helloworld", () => {
            //cc.log("加载场景完成");
        });

        //加载图集资源
        cc.loader.loadRes("item/item", cc.SpriteAtlas, (err, sa) => {
            LoadUtils.itemSpriteAtlas = sa;
            //cc.log("图集资源加载完成");
        })

        //加载音效资源
        LoadUtils.loadResDir("audio", () => {
            cc.log("音效资源加载完成")
        });

        let self = this;
        //初始化Labitem
        LoadUtils.loadRes("prefab/LabItem", cc.Prefab, function (prefab) {
            for (let i = 0; i < 50; i++) {
                let item: cc.Node = cc.instantiate(prefab);
                LoadUtils.labItemPool.put(item);
            }
            //cc.log(LoadUtils.itemPool);
        })

        //初始化item
        LoadUtils.loadRes("prefab/propItem", cc.Prefab, function (prefab) {
            for (let i = 0; i < 50; i++) {
                let item: cc.Node = cc.instantiate(prefab);
                LoadUtils.itemPool.put(item);
            }
            //cc.log(LoadUtils.itemPool);
            // if (cc.sys.os !== cc.sys.OS_ANDROID) { //Android 平台需要初始化后才会开始游戏
            //     self.loadScene();
            // }
            self.loadScene();
        })
    }

    loadScene() {
        cc.director.loadScene("helloworld", () => {
            cc.log("开始切换场景");
        })
    }

    /**开始游戏 */
    startGame() {
        this.loadScene();
    }
}
