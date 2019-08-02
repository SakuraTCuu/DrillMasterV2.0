import { SerchUtil } from "../Interface";
export class T_OutLine {
    //活动ID
    public id: number = 0;
    //描述
    public desc: string = "";
    //等级
    public level: number = 0;
    //离线收益
    public income: number = 0;
    //升级消耗  
    public expend: number = 0;
}

//
// 1升2 增加6元    2~9每级增加4元，升级所需费用*1.25
// 10级之后，升级增加=当前数值*1.25  ，升级所需费用*1.25
//item 对应表
const _T_OutLine_ = [
    {
        "id": 1,
        "desc": "离线收益等级:1,升级消耗:280$",
        "level": 1,
        "income": 6,
        "expend": 280
    }, {
        "id": 2,
        "desc": "离线收益等级:2,升级消耗:350$",
        "level": 2,
        "income": 12,
        "expend": 350
    }, {
        "id": 3,
        "desc": "离线收益等级:3,升级消耗:438$",
        "level": 3,
        "income": 16,
        "expend": 438
    }, {
        "id": 4,
        "desc": "离线收益等级:4,升级消耗:547$",
        "level": 4,
        "income": 20,
        "expend": 547
    }, {
        "id": 5,
        "desc": "离线收益等级:5,升级消耗:684$",
        "level": 5,
        "income": 24,
        "expend": 684
    }, {
        "id": 6,
        "desc": "离线收益等级:6,升级消耗:854$",
        "level": 6,
        "income": 28,
        "expend": 854
    }, {
        "id": 7,
        "desc": "离线收益等级:7,升级消耗:1068$",
        "level": 7,
        "income": 32,
        "expend": 1068
    }, {
        "id": 8,
        "desc": "离线收益等级:8,升级消耗:1335$",
        "level": 8,
        "income": 36,
        "expend": 1335
    }, {
        "id": 9,
        "desc": "离线收益等级:9,升级消耗:1669$",
        "level": 9,
        "income": 40,
        "expend": 1669
    }, {
        "id": 10,
        "desc": "离线收益等级:10,升级消耗:2086$",
        "level": 10,
        "income": 50,
        "expend": 2086
    }, {
        "id": 11,
        "desc": "离线收益等级:11,升级消耗:2608$",
        "level": 11,
        "income": 63,
        "expend": 2608
    }, {
        "id": 12,
        "desc": "离线收益等级:12,升级消耗:3260$",
        "level": 12,
        "income": 79,
        "expend": 3260
    }, {
        "id": 13,
        "desc": "离线收益等级:13,升级消耗:4075$",
        "level": 13,
        "income": 99,
        "expend": 4075
    }, {
        "id": 14,
        "desc": "离线收益等级:14,升级消耗:5093$",
        "level": 14,
        "income": 124,
        "expend": 5093
    }, {
        "id": 15,
        "desc": "离线收益等级:15,升级消耗:6366$",
        "level": 15,
        "income": 155,
        "expend": 6366
    }, {
        "id": 16,
        "desc": "离线收益等级:16,升级消耗:7958$",
        "level": 16,
        "income": 194,
        "expend": 7958
    }, {
        "id": 17,
        "desc": "离线收益等级:17,升级消耗:9948$",
        "level": 17,
        "income": 243,
        "expend": 9948
    }, {
        "id": 18,
        "desc": "离线收益等级:18,升级消耗:12434$",
        "level": 18,
        "income": 304,
        "expend": 12434
    }, {
        "id": 19,
        "desc": "离线收益等级:19,升级消耗:15543$",
        "level": 19,
        "income": 380,
        "expend": 15543
    }, {
        "id": 20,
        "desc": "离线收益等级:20,升级消耗:19429$",
        "level": 20,
        "income": 475,
        "expend": 19429
    }, {
        "id": 21,
        "desc": "离线收益等级:21,升级消耗:24286$",
        "level": 21,
        "income": 594,
        "expend": 24286
    }, {
        "id": 22,
        "desc": "离线收益等级:22,升级消耗:30358$",
        "level": 22,
        "income": 743,
        "expend": 30358
    }, {
        "id": 23,
        "desc": "离线收益等级:23,升级消耗:37947$",
        "level": 23,
        "income": 929,
        "expend": 37947
    }, {
        "id": 24,
        "desc": "离线收益等级:24,升级消耗:47434$",
        "level": 24,
        "income": 1161,
        "expend": 47434
    }, {
        "id": 25,
        "desc": "离线收益等级:25,升级消耗:59292$",
        "level": 25,
        "income": 1451,
        "expend": 59292
    }, {
        "id": 26,
        "desc": "离线收益等级:26,升级消耗:74115$",
        "level": 26,
        "income": 1814,
        "expend": 74115
    }, {
        "id": 27,
        "desc": "离线收益等级:27,升级消耗:92644$",
        "level": 27,
        "income": 2268,
        "expend": 92644
    }, {
        "id": 28,
        "desc": "离线收益等级:28,升级消耗:115805$",
        "level": 28,
        "income": 2835,
        "expend": 115805
    }, {
        "id": 29,
        "desc": "离线收益等级:29,升级消耗:144757$",
        "level": 29,
        "income": 3544,
        "expend": 144757
    }, {
        "id": 30,
        "desc": "离线收益等级:30,升级消耗:180946$",
        "level": 30,
        "income": 4430,
        "expend": 180946
    }, {
        "id": 31,
        "desc": "离线收益等级:31,升级消耗:226182$",
        "level": 31,
        "income": 5538,
        "expend": 226182
    }, {
        "id": 32,
        "desc": "离线收益等级:32,升级消耗:282728$",
        "level": 32,
        "income": 6923,
        "expend": 282728
    }, {
        "id": 33,
        "desc": "离线收益等级:33,升级消耗:353410$",
        "level": 33,
        "income": 8654,
        "expend": 353410
    }, {
        "id": 34,
        "desc": "离线收益等级:34,升级消耗:441762$",
        "level": 34,
        "income": 10818,
        "expend": 441762
    }, {
        "id": 35,
        "desc": "离线收益等级:35,升级消耗:552203$",
        "level": 35,
        "income": 13523,
        "expend": 552203
    }, {
        "id": 36,
        "desc": "离线收益等级:36,升级消耗:690253$",
        "level": 36,
        "income": 16904,
        "expend": 690253
    }, {
        "id": 37,
        "desc": "离线收益等级:37,升级消耗:862817$",
        "level": 37,
        "income": 21130,
        "expend": 862817
    }, {
        "id": 38,
        "desc": "离线收益等级:38,升级消耗:1078521$",
        "level": 38,
        "income": 26413,
        "expend": 1078521
    }, {
        "id": 39,
        "desc": "离线收益等级:39,升级消耗:1348151$",
        "level": 39,
        "income": 33016,
        "expend": 1348151
    }, {
        "id": 40,
        "desc": "离线收益等级:40,升级消耗:1685189$",
        "level": 40,
        "income": 41270,
        "expend": 1685189
    }, {
        "id": 41,
        "desc": "离线收益等级:41,升级消耗:2106486$",
        "level": 41,
        "income": 51588,
        "expend": 2106486
    }, {
        "id": 42,
        "desc": "离线收益等级:42,升级消耗:2633107$",
        "level": 42,
        "income": 64485,
        "expend": 2633107
    }, {
        "id": 43,
        "desc": "离线收益等级:43,升级消耗:3291384$",
        "level": 43,
        "income": 80606,
        "expend": 3291384
    }, {
        "id": 44,
        "desc": "离线收益等级:44,升级消耗:4114230$",
        "level": 44,
        "income": 100758,
        "expend": 4114230
    }, {
        "id": 45,
        "desc": "离线收益等级:45,升级消耗:5142788$",
        "level": 45,
        "income": 125948,
        "expend": 5142788
    }, {
        "id": 46,
        "desc": "离线收益等级:46,升级消耗:6428485$",
        "level": 46,
        "income": 157435,
        "expend": 6428485
    }, {
        "id": 47,
        "desc": "离线收益等级:47,升级消耗:8035606$",
        "level": 47,
        "income": 196794,
        "expend": 8035606
    }, {
        "id": 48,
        "desc": "离线收益等级:48,升级消耗:10044507$",
        "level": 48,
        "income": 245993,
        "expend": 10044507
    }, {
        "id": 49,
        "desc": "离线收益等级:49,升级消耗:12555634$",
        "level": 49,
        "income": 307491,
        "expend": 12555634
    }, {
        "id": 50,
        "desc": "离线收益等级:50,升级消耗:15694543$",
        "level": 50,
        "income": 384364,
        "expend": 15694543
    }, {
        "id": 51,
        "desc": "离线收益等级:51,升级消耗:19618179$",
        "level": 51,
        "income": 480455,
        "expend": 19618179
    }, {
        "id": 52,
        "desc": "离线收益等级:52,升级消耗:24522723$",
        "level": 52,
        "income": 600569,
        "expend": 24522723
    }, {
        "id": 53,
        "desc": "离线收益等级:53,升级消耗:30653404$",
        "level": 53,
        "income": 750711,
        "expend": 30653404
    }, {
        "id": 54,
        "desc": "离线收益等级:54,升级消耗:38316755$",
        "level": 54,
        "income": 938389,
        "expend": 38316755
    }, {
        "id": 55,
        "desc": "离线收益等级:55,升级消耗:47895944$",
        "level": 55,
        "income": 1172986,
        "expend": 47895944
    }, {
        "id": 56,
        "desc": "离线收益等级:56,升级消耗:59869930$",
        "level": 56,
        "income": 1466233,
        "expend": 59869930
    }, {
        "id": 57,
        "desc": "离线收益等级:57,升级消耗:74837412$",
        "level": 57,
        "income": 1832791,
        "expend": 74837412
    }, {
        "id": 58,
        "desc": "离线收益等级:58,升级消耗:93546765$",
        "level": 58,
        "income": 2290989,
        "expend": 93546765
    }, {
        "id": 59,
        "desc": "离线收益等级:59,升级消耗:116933456$",
        "level": 59,
        "income": 2863736,
        "expend": 116933456
    }, {
        "id": 60,
        "desc": "离线收益等级:60,升级消耗:146166820$",
        "level": 60,
        "income": 3579670,
        "expend": 146166820
    }, {
        "id": 61,
        "desc": "离线收益等级:61,升级消耗:182708525$",
        "level": 61,
        "income": 4474588,
        "expend": 182708525
    }, {
        "id": 62,
        "desc": "离线收益等级:62,升级消耗:228385656$",
        "level": 62,
        "income": 5593235,
        "expend": 228385656
    }, {
        "id": 63,
        "desc": "离线收益等级:63,升级消耗:285482070$",
        "level": 63,
        "income": 6991544,
        "expend": 285482070
    }, {
        "id": 64,
        "desc": "离线收益等级:64,升级消耗:356852588$",
        "level": 64,
        "income": 8739430,
        "expend": 356852588
    }, {
        "id": 65,
        "desc": "离线收益等级:65,升级消耗:446065735$",
        "level": 65,
        "income": 10924288,
        "expend": 446065735
    }, {
        "id": 66,
        "desc": "离线收益等级:66,升级消耗:557582169$",
        "level": 66,
        "income": 13655360,
        "expend": 557582169
    }, {
        "id": 67,
        "desc": "离线收益等级:67,升级消耗:696977711$",
        "level": 67,
        "income": 17069200,
        "expend": 696977711
    }, {
        "id": 68,
        "desc": "离线收益等级:68,升级消耗:871222139$",
        "level": 68,
        "income": 21336500,
        "expend": 871222139
    },
    //无上限
    // 收益 *=1.25  消耗*=1.25;
];

// 中间展示的列表数据类型
export class T_OutLine_Table {
    public static getVoByKey(key: number): T_OutLine {
        var len = _T_OutLine_.length;
        let data: T_OutLine = SerchUtil.binary_search(_T_OutLine_, "id", 0, len, key);
        return data;
    }

    public static getAllVo(): Array<T_OutLine> {
        return _T_OutLine_;
    }
}