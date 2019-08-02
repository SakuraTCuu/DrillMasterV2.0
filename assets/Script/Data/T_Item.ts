import { SerchUtil } from "../Interface";
export class T_Item {
    //道具ID
    public id: number = 0;
    //描述
    public desc: string = "";
    //价值
    public value: number = 0;
}
//item 对应表
const _T_Item_ = [
    { id: 1, desc: "石头", value: 100, },
    { id: 2, desc: "帽子", value: 150, },
    { id: 3, desc: "TNT", value: 250, },
    { id: 4, desc: "锤子", value: 200, },
    { id: 5, desc: "地图", value: 250, },
    { id: 6, desc: "钩子", value: 300, },
    { id: 7, desc: "船舵", value: 550, },
    { id: 8, desc: "海盗刀", value: 650, },
    { id: 9, desc: "衣服", value: 400, },
    { id: 10, desc: "奖杯", value: 600, },
    { id: 11, desc: "茶杯", value: 1200, },
    { id: 12, desc: "盘子", value: 1450, },
    { id: 13, desc: "吊坠", value: 950, },
    { id: 14, desc: "白玉盘", value: 1450, },
    { id: 15, desc: "海盗头", value: 2350, },
    { id: 16, desc: "酒瓶", value: 3250, },
    { id: 17, desc: "石头盘", value: 2050, },
    { id: 18, desc: "石锤", value: 2750, },
    { id: 19, desc: "恐龙蛋", value: 6000, },
    { id: 20, desc: "牙齿", value: 8000, },
    { id: 21, desc: "红宝石", value: 7000, },
    { id: 22, desc: "花柱", value: 4500, },
    { id: 23, desc: "红水晶", value: 12500, },
    { id: 24, desc: "柱子", value: 10000, },
    { id: 25, desc: "椰子", value: 15000, },
    { id: 26, desc: "72", value: 15000, },
    { id: 27, desc: "73", value: 30000, },
    { id: 28, desc: "74", value: 45000, },
    { id: 29, desc: "81", value: 15000, },
    { id: 30, desc: "82", value: 25000, },
    { id: 31, desc: "83", value: 40000, },
    { id: 32, desc: "84", value: 75000, },
    { id: 33, desc: "91", value: 20000, },
    { id: 34, desc: "92", value: 35000, },
    { id: 35, desc: "93", value: 50000, },
    { id: 36, desc: "94", value: 90000, },
    { id: 37, desc: "101", value: 30000, },
    { id: 38, desc: "102", value: 50000, },
    { id: 39, desc: "103", value: 75000, },
    { id: 40, desc: "104", value: 120000, },
];

// 中间展示的列表数据类型
export class T_Item_Table {
    public static getVoByKey(key: number): T_Item {
        var len = _T_Item_.length;
        let data: T_Item = SerchUtil.binary_search(_T_Item_, "id", 0, len, key);
        return data;
    }

    public static getAllVo(): Array<T_Item> {
        return _T_Item_;
    }
}
