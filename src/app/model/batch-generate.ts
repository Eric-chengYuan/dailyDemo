export interface BatchGenerate {
    id?: string;                     // 人员的id
    name?: string;                  // 生成的文件名称
    beginDate?: string;              // 开始模拟的时间
    days?: number;           // 生成的天数
    dailyClockInSet?: any;            // 常规打卡时间
    vocationDatesSet?: any;               // 不需计算的节假日
    saturdayClockInSet?: any;    // 周六特殊班次的打卡时间
}