import { SerchUtil } from "../Interface";
export class T_Warehouse {
    //等级ID
    public id: number = 0;
    //描述
    public desc: string = "";
    //等级
    public level: number = 0;
    //容量
    public count: number = 0;
    //升级消耗  
    public expend: number = 0;
}
//item 对应表
const _T_Warehouse_ = [
    {
        "id": 1,
        "desc": "仓库容量:8,升级消耗:280$",
        "level": 1,
        "count": 8,
        "expend": 280
    }, {
        "id": 2,
        "desc": "仓库容量:9,升级消耗:350$",
        "level": 2,
        "count": 9,
        "expend": 350
    }, {
        "id": 3,
        "desc": "仓库容量:10,升级消耗:438$",
        "level": 3,
        "count": 10,
        "expend": 438
    }, {
        "id": 4,
        "desc": "仓库容量:11,升级消耗:548$",
        "level": 4,
        "count": 11,
        "expend": 548
    }, {
        "id": 5,
        "desc": "仓库容量:12,升级消耗:685$",
        "level": 5,
        "count": 12,
        "expend": 685
    }, {
        "id": 6,
        "desc": "仓库容量:13,升级消耗:856$",
        "level": 6,
        "count": 13,
        "expend": 856
    }, {
        "id": 7,
        "desc": "仓库容量:14,升级消耗:1070$",
        "level": 7,
        "count": 14,
        "expend": 1070
    }, {
        "id": 8,
        "desc": "仓库容量:15,升级消耗:1338$",
        "level": 8,
        "count": 15,
        "expend": 1338
    }, {
        "id": 9,
        "desc": "仓库容量:16,升级消耗:1673$",
        "level": 9,
        "count": 16,
        "expend": 1673
    }, {
        "id": 10,
        "desc": "仓库容量:17,升级消耗:2091$",
        "level": 10,
        "count": 17,
        "expend": 2091
    }, {
        "id": 11,
        "desc": "仓库容量:18,升级消耗:2614$",
        "level": 11,
        "count": 18,
        "expend": 2614
    }, {
        "id": 12,
        "desc": "仓库容量:19,升级消耗:3268$",
        "level": 12,
        "count": 19,
        "expend": 3268
    }, {
        "id": 13,
        "desc": "仓库容量:20,升级消耗:4085$",
        "level": 13,
        "count": 20,
        "expend": 4085
    }, {
        "id": 14,
        "desc": "仓库容量:21,升级消耗:5106$",
        "level": 14,
        "count": 21,
        "expend": 5106
    }, {
        "id": 15,
        "desc": "仓库容量:22,升级消耗:6383$",
        "level": 15,
        "count": 22,
        "expend": 6383
    }, {
        "id": 16,
        "desc": "仓库容量:23,升级消耗:7979$",
        "level": 16,
        "count": 23,
        "expend": 7979
    }, {
        "id": 17,
        "desc": "仓库容量:24,升级消耗:9974$",
        "level": 17,
        "count": 24,
        "expend": 9974
    }, {
        "id": 18,
        "desc": "仓库容量:25,升级消耗:12468$",
        "level": 18,
        "count": 25,
        "expend": 12468
    }, {
        "id": 19,
        "desc": "仓库容量:26,升级消耗:15585$",
        "level": 19,
        "count": 26,
        "expend": 15585
    }, {
        "id": 20,
        "desc": "仓库容量:27,升级消耗:19481$",
        "level": 20,
        "count": 27,
        "expend": 19481
    }, {
        "id": 21,
        "desc": "仓库容量:28,升级消耗:24351$",
        "level": 21,
        "count": 28,
        "expend": 24351
    }, {
        "id": 22,
        "desc": "仓库容量:29,升级消耗:30439$",
        "level": 22,
        "count": 29,
        "expend": 30439
    }, {
        "id": 23,
        "desc": "仓库容量:30,升级消耗:38049$",
        "level": 23,
        "count": 30,
        "expend": 38049
    }, {
        "id": 24,
        "desc": "仓库容量:31,升级消耗:47561$",
        "level": 24,
        "count": 31,
        "expend": 47561
    }, {
        "id": 25,
        "desc": "仓库容量:32,升级消耗:59451$",
        "level": 25,
        "count": 32,
        "expend": 59451
    }, {
        "id": 26,
        "desc": "仓库容量:33,升级消耗:74314$",
        "level": 26,
        "count": 33,
        "expend": 74314
    }, {
        "id": 27,
        "desc": "仓库容量:34,升级消耗:92893$",
        "level": 27,
        "count": 34,
        "expend": 92893
    }, {
        "id": 28,
        "desc": "仓库容量:35,升级消耗:116116$",
        "level": 28,
        "count": 35,
        "expend": 116116
    }, {
        "id": 29,
        "desc": "仓库容量:36,升级消耗:145145$",
        "level": 29,
        "count": 36,
        "expend": 145145
    }, {
        "id": 30,
        "desc": "仓库容量:37,升级消耗:181431$",
        "level": 30,
        "count": 37,
        "expend": 181431
    }, {
        "id": 31,
        "desc": "仓库容量:38,升级消耗:226789$",
        "level": 31,
        "count": 38,
        "expend": 226789
    }, {
        "id": 32,
        "desc": "仓库容量:39,升级消耗:283486$",
        "level": 32,
        "count": 39,
        "expend": 283486
    }, {
        "id": 33,
        "desc": "仓库容量:40,升级消耗:354358$",
        "level": 33,
        "count": 40,
        "expend": 354358
    }, {
        "id": 34,
        "desc": "仓库容量:41,升级消耗:442948$",
        "level": 34,
        "count": 41,
        "expend": 442948
    }, {
        "id": 35,
        "desc": "仓库容量:42,升级消耗:553685$",
        "level": 35,
        "count": 42,
        "expend": 553685
    }, {
        "id": 36,
        "desc": "仓库容量:43,升级消耗:692106$",
        "level": 36,
        "count": 43,
        "expend": 692106
    }, {
        "id": 37,
        "desc": "仓库容量:44,升级消耗:865133$",
        "level": 37,
        "count": 44,
        "expend": 865133
    }, {
        "id": 38,
        "desc": "仓库容量:45,升级消耗:1081416$",
        "level": 38,
        "count": 45,
        "expend": 1081416
    }, {
        "id": 39,
        "desc": "仓库容量:46,升级消耗:1351770$",
        "level": 39,
        "count": 46,
        "expend": 1351770
    }, {
        "id": 40,
        "desc": "仓库容量:47,升级消耗:1689713$",
        "level": 40,
        "count": 47,
        "expend": 1689713
    }, {
        "id": 41,
        "desc": "仓库容量:48,升级消耗:2112141$",
        "level": 41,
        "count": 48,
        "expend": 2112141
    }, {
        "id": 42,
        "desc": "仓库容量:49,升级消耗:2640176$",
        "level": 42,
        "count": 49,
        "expend": 2640176
    }, {
        "id": 43,
        "desc": "仓库容量:50,升级消耗:3300220$",
        "level": 43,
        "count": 50,
        "expend": 3300220
    }, 
    // {
    //     "id": 44,
    //     "desc": "仓库容量:51,升级消耗:4125275$",
    //     "level": 44,
    //     "count": 51,
    //     "expend": 4125275
    // }, {
    //     "id": 45,
    //     "desc": "仓库容量:52,升级消耗:5156594$",
    //     "level": 45,
    //     "count": 52,
    //     "expend": 5156594
    // },
];

// 中间展示的列表数据类型
export class T_Warehouse_Table {
    public static getVoByKey(key: number): T_Warehouse {
        var len = _T_Warehouse_.length;
        let data: T_Warehouse = SerchUtil.binary_search(_T_Warehouse_, "id", 0, len, key);
        return data;
    }

    public static getAllVo(): Array<T_Warehouse> {
        return _T_Warehouse_;
    }
}
