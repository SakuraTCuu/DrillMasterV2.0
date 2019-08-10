import { SerchUtil } from "../Interface";
export class T_Depth {
    //活动ID
    public id: number = 0;
    //描述
    public desc: string = "";
    //等级
    public level: number = 0;
    //深度
    public depth: number = 0;
    //升级消耗  
    public expend: number = 0;
}
//item 对应表
const _T_Depth_ = [
    {
        "id": 1,
        "desc": "深度:140,消耗:280$",
        "level": 1,
        "depth": 140,
        "expend": 280
    }, {
        "id": 2,
        "desc": "深度:150,消耗:350$",
        "level": 2,
        "depth": 150,
        "expend": 350
    }, {
        "id": 3,
        "desc": "深度:160,消耗:438$",
        "level": 3,
        "depth": 160,
        "expend": 438
    }, {
        "id": 4,
        "desc": "深度:170,消耗:547$",
        "level": 4,
        "depth": 170,
        "expend": 547
    }, {
        "id": 5,
        "desc": "深度:180,消耗:684$",
        "level": 5,
        "depth": 180,
        "expend": 684
    }, {
        "id": 6,
        "desc": "深度:190,消耗:854$",
        "level": 6,
        "depth": 190,
        "expend": 854
    }, {
        "id": 7,
        "desc": "深度:200,消耗:1068$",
        "level": 7,
        "depth": 200,
        "expend": 1068
    }, {
        "id": 8,
        "desc": "深度:210,消耗:1335$",
        "level": 8,
        "depth": 210,
        "expend": 1335
    }, {
        "id": 9,
        "desc": "深度:220,消耗:1669$",
        "level": 9,
        "depth": 220,
        "expend": 1669
    }, {
        "id": 10,
        "desc": "深度:230,消耗:2086$",
        "level": 10,
        "depth": 230,
        "expend": 2086
    }, {
        "id": 11,
        "desc": "深度:240,消耗:2608$",
        "level": 11,
        "depth": 240,
        "expend": 2608
    }, {
        "id": 12,
        "desc": "深度:250,消耗:3260$",
        "level": 12,
        "depth": 250,
        "expend": 3260
    }, {
        "id": 13,
        "desc": "深度:260,消耗:4075$",
        "level": 13,
        "depth": 260,
        "expend": 4075
    }, {
        "id": 14,
        "desc": "深度:270,消耗:5093$",
        "level": 14,
        "depth": 270,
        "expend": 5093
    }, {
        "id": 15,
        "desc": "深度:280,消耗:6366$",
        "level": 15,
        "depth": 280,
        "expend": 6366
    }, {
        "id": 16,
        "desc": "深度:290,消耗:7958$",
        "level": 16,
        "depth": 290,
        "expend": 7958
    }, {
        "id": 17,
        "desc": "深度:300,消耗:9948$",
        "level": 17,
        "depth": 300,
        "expend": 9948
    }, {
        "id": 18,
        "desc": "深度:310,消耗:12434$",
        "level": 18,
        "depth": 310,
        "expend": 12434
    }, {
        "id": 19,
        "desc": "深度:320,消耗:15543$",
        "level": 19,
        "depth": 320,
        "expend": 15543
    }, {
        "id": 20,
        "desc": "深度:330,消耗:19429$",
        "level": 20,
        "depth": 330,
        "expend": 19429
    }, {
        "id": 21,
        "desc": "深度:340,消耗:24286$",
        "level": 21,
        "depth": 340,
        "expend": 24286
    }, {
        "id": 22,
        "desc": "深度:350,消耗:30358$",
        "level": 22,
        "depth": 350,
        "expend": 30358
    }, {
        "id": 23,
        "desc": "深度:360,消耗:37947$",
        "level": 23,
        "depth": 360,
        "expend": 37947
    }, {
        "id": 24,
        "desc": "深度:370,消耗:47434$",
        "level": 24,
        "depth": 370,
        "expend": 47434
    }, {
        "id": 25,
        "desc": "深度:380,消耗:59292$",
        "level": 25,
        "depth": 380,
        "expend": 59292
    }, {
        "id": 26,
        "desc": "深度:390,消耗:74115$",
        "level": 26,
        "depth": 390,
        "expend": 74115
    }, {
        "id": 27,
        "desc": "深度:400,消耗:92644$",
        "level": 27,
        "depth": 400,
        "expend": 92644
    }, {
        "id": 28,
        "desc": "深度:410,消耗:115805$",
        "level": 28,
        "depth": 410,
        "expend": 115805
    }, {
        "id": 29,
        "desc": "深度:420,消耗:144757$",
        "level": 29,
        "depth": 420,
        "expend": 144757
    }, {
        "id": 30,
        "desc": "深度:430,消耗:180946$",
        "level": 30,
        "depth": 430,
        "expend": 180946
    }, {
        "id": 31,
        "desc": "深度:440,消耗:226182$",
        "level": 31,
        "depth": 440,
        "expend": 226182
    }, {
        "id": 32,
        "desc": "深度:450,消耗:282728$",
        "level": 32,
        "depth": 450,
        "expend": 282728
    }, {
        "id": 33,
        "desc": "深度:460,消耗:353410$",
        "level": 33,
        "depth": 460,
        "expend": 353410
    }, {
        "id": 34,
        "desc": "深度:470,消耗:441762$",
        "level": 34,
        "depth": 470,
        "expend": 441762
    }, {
        "id": 35,
        "desc": "深度:480,消耗:552203$",
        "level": 35,
        "depth": 480,
        "expend": 552203
    }, {
        "id": 36,
        "desc": "深度:490,消耗:690253$",
        "level": 36,
        "depth": 490,
        "expend": 690253
    }, {
        "id": 37,
        "desc": "深度:500,消耗:862817$",
        "level": 37,
        "depth": 500,
        "expend": 862817
    }, {
        "id": 38,
        "desc": "深度:510,消耗:1078521$",
        "level": 38,
        "depth": 510,
        "expend": 1078521
    }, {
        "id": 39,
        "desc": "深度:520,消耗:1348151$",
        "level": 39,
        "depth": 520,
        "expend": 1348151
    }, {
        "id": 40,
        "desc": "深度:530,消耗:1685189$",
        "level": 40,
        "depth": 530,
        "expend": 1685189
    }, {
        "id": 41,
        "desc": "深度:540,消耗:2106486$",
        "level": 41,
        "depth": 540,
        "expend": 2106486
    }, {
        "id": 42,
        "desc": "深度:550,消耗:2633107$",
        "level": 42,
        "depth": 550,
        "expend": 2633107
    }, {
        "id": 43,
        "desc": "深度:560,消耗:3291384$",
        "level": 43,
        "depth": 560,
        "expend": 3291384
    }, {
        "id": 44,
        "desc": "深度:570,消耗:4114230$",
        "level": 44,
        "depth": 570,
        "expend": 4114230
    }, {
        "id": 45,
        "desc": "深度:580,消耗:5142788$",
        "level": 45,
        "depth": 580,
        "expend": 5142788
    }, {
        "id": 46,
        "desc": "深度:590,消耗:6428485$",
        "level": 46,
        "depth": 590,
        "expend": 6428485
    }, {
        "id": 47,
        "desc": "深度:600,消耗:8035606$",
        "level": 47,
        "depth": 600,
        "expend": 8035606
    }, {
        "id": 48,
        "desc": "深度:610,消耗:10044507$",
        "level": 48,
        "depth": 610,
        "expend": 10044507
    }, {
        "id": 49,
        "desc": "深度:620,消耗:12555634$",
        "level": 49,
        "depth": 620,
        "expend": 12555634
    }, {
        "id": 50,
        "desc": "深度:630,消耗:15694543$",
        "level": 50,
        "depth": 630,
        "expend": 15694543
    }, {
        "id": 51,
        "desc": "深度:640,消耗:19618179$",
        "level": 51,
        "depth": 640,
        "expend": 19618179
    }, {
        "id": 52,
        "desc": "深度:650,消耗:24522723$",
        "level": 52,
        "depth": 650,
        "expend": 24522723
    }, {
        "id": 53,
        "desc": "深度:660,消耗:30653404$",
        "level": 53,
        "depth": 660,
        "expend": 30653404
    }, {
        "id": 54,
        "desc": "深度:670,消耗:38316755$",
        "level": 54,
        "depth": 670,
        "expend": 38316755
    }, {
        "id": 55,
        "desc": "深度:680,消耗:47895944$",
        "level": 55,
        "depth": 680,
        "expend": 47895944
    }, {
        "id": 56,
        "desc": "深度:690,消耗:59869930$",
        "level": 56,
        "depth": 690,
        "expend": 59869930
    }, {
        "id": 57,
        "desc": "深度:700,消耗:74837412$",
        "level": 57,
        "depth": 700,
        "expend": 74837412
    }, {
        "id": 58,
        "desc": "深度:710,消耗:93546765$",
        "level": 58,
        "depth": 710,
        "expend": 93546765
    }, {
        "id": 59,
        "desc": "深度:720,消耗:116933456$",
        "level": 59,
        "depth": 720,
        "expend": 116933456
    }, {
        "id": 60,
        "desc": "深度:730,消耗:146166820$",
        "level": 60,
        "depth": 730,
        "expend": 146166820
    },
    //  {
    //     "id": 61,
    //     "desc": "深度:740,消耗:182708525$",
    //     "level": 61,
    //     "depth": 740,
    //     "expend": 182708525
    // }, {
    //     "id": 62,
    //     "desc": "深度:750,消耗:228385656$",
    //     "level": 62,
    //     "depth": 750,
    //     "expend": 228385656
    // }, {
    //     "id": 63,
    //     "desc": "深度:760,消耗:285482070$",
    //     "level": 63,
    //     "depth": 760,
    //     "expend": 285482070
    // }, {
    //     "id": 64,
    //     "desc": "深度:770,消耗:356852588$",
    //     "level": 64,
    //     "depth": 770,
    //     "expend": 356852588
    // }, {
    //     "id": 65,
    //     "desc": "深度:780,消耗:446065735$",
    //     "level": 65,
    //     "depth": 780,
    //     "expend": 446065735
    // }, {
    //     "id": 66,
    //     "desc": "深度:790,消耗:557582169$",
    //     "level": 66,
    //     "depth": 790,
    //     "expend": 557582169
    // }, {
    //     "id": 67,
    //     "desc": "深度:800,消耗:696977711$",
    //     "level": 67,
    //     "depth": 800,
    //     "expend": 696977711
    // }, {
    //     "id": 68,
    //     "desc": "深度:810,消耗:871222139$",
    //     "level": 68,
    //     "depth": 810,
    //     "expend": 871222139
    // }, // 共68 级    // depth *=1.25,   expend*=1.25;
];

// 中间展示的列表数据类型
export class T_Depth_Table {
    public static getVoByKey(key: number): T_Depth {
        var len = _T_Depth_.length;
        let data: T_Depth = SerchUtil.binary_search(_T_Depth_, "id", 0, len, key);
        return data;
    }

    public static getAllVo(): Array<T_Depth> {
        return _T_Depth_;
    }
}
