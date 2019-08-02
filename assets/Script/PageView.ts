const { ccclass, property } = cc._decorator;

export class PageEvent extends cc.Event {

    public static SCROLL_END: string = "view_scroll_end";

    public scrollType: string;

    public constructor(type: string, bubbles: boolean = false) {
        super(type, bubbles);
    }
}


@ccclass
export default class PageView extends cc.Component {

    //可视区域
    private _viewWidth: number;
    private _viewHeight: number;
    //item宽高
    private _itemWidth: number;
    //item之间的间隔
    private _interval: number;
    //是否是循环滚动
    private _loop: boolean;
    //数据列表
    private _dataList: Array<cc.Node>;
    //列表容器
    private _container: cc.Node;
    //起始触摸点
    private _beginPoint: cc.Vec2;
    //显示的item数量
    private SHOW_NUMBER: number;
    //是否在触摸中
    private _isTouchBegin: boolean = false;
    private _isInTouch: boolean = false;
    private _isTouchMove:boolean =false;
    private mask: cc.Rect = null;
    private touchEnabled: boolean = false;

    onLoad() {
    }

    /**
     * 初始化滚动视图
     */
    public init(viewWidth: number, viewHeight: number, itemWidth: number, interval: number, loop: boolean = false): void {
        this._viewWidth = viewWidth;
        this._viewHeight = viewHeight;
        this._itemWidth = itemWidth;
        this._interval = interval;
        this._loop = loop;
        //Add mask
        let ccRect: cc.Rect = new cc.Rect(0, 0, viewWidth, viewHeight);
        this.mask = ccRect;
        this.touchEnabled = true;
        this.SHOW_NUMBER = Math.ceil(viewWidth / (itemWidth + interval));
    }

    public startRegistEvent(): void {
        //Add event listener.
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchBegin, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
    }

    /**
		 * Set data source
		 */
    public setData(list: Array<cc.Node>): void {
        this._dataList = list;
        this._container = new cc.Node();
        this.node.addChild(this._container);
        this.sortData();
        this.showView();
    }

    //便显示，将最后一个元素放到第一个元素前，准备显示
    public sortData(): void {
        let last = this._dataList.pop();
        this._dataList.unshift(last);
    }

    /**
		 * 显示
		 */
    private showView(): void {
        let initX = -(this._itemWidth + this._interval);
        let initY = 0;
        for (let i = 0; i < this._dataList.length; i++) {
            let item = this._dataList[i];
            this._container.addChild(item);
            item.x = initX;
            item.y = initY;
            initX = initX + this._itemWidth + this._interval;
        }
    }

    private touchBegin(evt: cc.Event.EventTouch) {
        cc.log("start-->>", evt.getLocation())
        if (this._isTouchBegin) return;
        this._isTouchBegin = true;
        this._beginPoint = evt.target.convertToWorldSpaceAR(cc.v2(evt.getLocationX(), evt.getLocationX()));
    }

    private touchMove(evt: cc.Event.EventTouch) {
        if(this._isTouchMove) return;
        this._isTouchMove = true;
        cc.log("move->>", evt.getLocation());
        let movePos: cc.Vec2 = evt.target.convertToWorldSpaceAR(cc.v2(evt.getLocationX(), evt.getLocationX()));
        let dis = movePos.x - this._beginPoint.x;
        if (Math.abs(dis) > 20) {
            console.log('翻到下一个地方');
            if (dis > 0) {
                this.prevPosition();
            } else {
                this.nextPosition();
            }
        }
    }

    private touchEnd(evt: cc.Event.EventTouch) {
        if (this._isInTouch) return;
        if (this._beginPoint == null) {
            return;
        }
        let currPoint = evt.target.convertToWorldSpaceAR(cc.v2(evt.getLocationX(), evt.getLocationX()));
        //判断是拖拽还是点击
        if (Math.abs(currPoint.x - this._beginPoint.x) > 20) {
            if (currPoint.x - this._beginPoint.x > 0) {
                this.nextPosition();
            } else {
                this.prevPosition();
            }
        } else {
            for (let i = 0; i < this._dataList.length; i++) {
                let item = this._dataList[i];
                //判断点击的是否是当前 节点
                // if (item.hitTestPoint(currPoint.x, currPoint.y)) {
                //     item.clicked();
                //     break;
                // }
            }
        }
        this._beginPoint == null;
    }

    //滑动到下一个位置-右滑
    public nextPosition(isTween: boolean = true): void {
        this._isInTouch = true;
        let temp = this._dataList[0];
        let last = this._dataList.pop();
        last.x = temp.x - (this._itemWidth + this._interval);
        this._dataList.unshift(last);
        let dist = this._itemWidth + this._interval;
        for (let i = 0; i < this._dataList.length; i++) {
            (function (_item, _dist: number, _isTween: boolean): void {
                let toX = _item.x + _dist;
                let act = cc.moveTo(0.15, toX, _item.y);
                if (_isTween) {
                    _item.runAction(act);
                } else {
                    _item.x = toX;
                }
            })(this._dataList[i], dist, isTween);
        }
        let self = this;
        if (isTween) {
            setTimeout(function () {
                let daterEvent = new PageEvent(PageEvent.SCROLL_END, false);
                // let daterEvent = new burn.event.PageEvent(burn.event.PageEvent.SCROLL_END);
                daterEvent.scrollType = "right";
                self.node.dispatchEvent(daterEvent);
                self._isInTouch = false;
                self._isTouchBegin = false;
                self._isTouchMove =false;
            }, 150);
        } else {
            self._isInTouch = false;
            self._isTouchBegin = false;
            self._isTouchMove =false;
        }
    }

    //滑动到上一个位置-左滑
    public prevPosition(isTween: boolean = true): void {
        this._isInTouch = true;
        let last = this._dataList[this._dataList.length - 1];
        let first = this._dataList.shift();
        first.x = last.x + (this._itemWidth + this._interval);
        this._dataList.push(first);
        let dist = this._itemWidth + this._interval;
        for (let i = 0; i < this._dataList.length; i++) {
            (function (_item, _dist: number, _isTween: boolean): void {
                //let tw = egret.Tween.get(_item, { loop: false });
                let toX = _item.x - _dist;
                if (_isTween) {
                    let act = cc.moveTo(0.15, toX, _item.y);
                    _item.runAction(act);
                    // tw.to({ x: toX }, 150).call(function (): void {
                    //     egret.Tween.removeTweens(_item);
                    // });
                } else {
                    _item.x = toX;
                }
            })(this._dataList[i], dist, isTween);
        }
        let self = this;
        if (isTween) {
            setTimeout(function () {
                let daterEvent = new PageEvent(PageEvent.SCROLL_END);
                daterEvent.scrollType = "left";
                self.node.dispatchEvent(daterEvent);
                self._isInTouch = false;
                self._isTouchBegin = false;
                self._isTouchMove =false;
            }, 150);
        } else {
            self._isInTouch = false;
            self._isTouchBegin = false;
            self._isTouchMove =false;
        }
    }

    //滑动到指定页
    public gotoPage(idx: number): void {
        if (idx <= this.getVos().length && idx > 2) {
            for (let i = 2; i < idx; i++) {
                this.prevPosition(false);
            }
        } else if (idx < 2 && idx >= 1) {
            this.nextPosition(false);
        }
    }

    //return the data list.
    public getVos(): Array<cc.Node> {
        return this._dataList;
    }

    //Get the visible item list.
    public getVisibleItems(): Array<cc.Node> {
        let arr = new Array<cc.Node>();
        for (let i = 0; i < this._dataList.length; i++) {
            let item = this._dataList[i];
            if (item.x >= 0 && arr.length <= this.SHOW_NUMBER) {
                arr.push(item);
            }
        }
        return arr;
    }

    //销毁函数
    public onDestroy(): void {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchBegin, this);
        // this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
    }
}