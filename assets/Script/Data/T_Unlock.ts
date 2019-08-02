import { SerchUtil } from "../Interface";
export class T_Unlock {
    //钻头ID
    public id: number = 0;
    //描述
    public name: string = "";
    //解锁需要物品
    public value: string = "";
}
//item 对应表
const _T_Unlock_ = [
    { id: 0, name: "默认", value: "", },
    { id: 1, name: "勘探者", value: "1_2_3_4", },
    { id: 2, name: "海盗", value: "5_6_7_8", },
    { id: 3, name: "中世纪", value: "9_10_11_12", },
    { id: 4, name: "罗马", value: "13_14_15_16", },
    { id: 5, name: "史前", value: "17_18_19_20", },
    { id: 6, name: "火星", value: "21_22_23_24", },
    { id: 7, name: "毛利", value: "25_26_27_28", },
    { id: 8, name: "复古", value: "29_30_31_32", },
    { id: 9, name: "妖怪", value: "33_34_35_36", },
    { id: 10, name: "独角兽", value: "37_38_39_40", },
];

// 中间展示的列表数据类型
export class T_Unlock_Table {
    public static getVoByKey(key: number): T_Unlock {
        var len = _T_Unlock_.length;
        let data: T_Unlock = SerchUtil.binary_search(_T_Unlock_, "id", 0, len, key);
        return data;
    }

    public static getAllVo(): Array<T_Unlock> {
        return _T_Unlock_;
    }
}
