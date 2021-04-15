import { Component, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BatchGenerate } from 'src/app/model';
import { DateTransferUtil } from 'src/app/utils';

@Component({
  selector: 'app-generate-clock-in-data',
  templateUrl: './generate-clock-in-data.component.html',
  styleUrls: ['./generate-clock-in-data.component.less']
})
export class GenerateClockInDataComponent implements OnInit {

  // 开始模拟数据的时间
  beginDate = '';

  // 要模拟多少天的数据
  days = null;

  // 文件名称，目前被ID取代【2019-11-12】
  name = '默认测试';

  // 人员ID
  id = null;

  // 增长的天数  一天里面有24小时  每个小时60分钟  每分钟60秒   每秒有1000毫秒
  addCount = 86400000; // 24 * 3600 * 1000 常量比带运算的更加节省时间

  // 日常打卡时间
  dailyClockIn: Date | null = null;
  dailyClockInSet = new Set().add('08:00:00').add('12:00:00').add('14:00:00').add('18:00:00');

  // 周六班次打卡时间
  saturdayClockIn: Date | null = null;
  saturdayClockInSet = new Set().add('08:00:00').add('12:00:00').add('14:00:00').add('18:00:00');

  // 特殊节假日放假时间，用于过滤
  vocationDates: Date | null = null;
  vocationDatesSet = new Set().add('2021-10-01').add('2021-10-02').add('2021-10-03');

  // 控制tipsModel
  isVisible = false;

  constructor(private modal: NzModalService, private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
  }

  addDate(date, type?: string) {
    switch (type) {
      case 'daily':
        this.dailyClockInSet.add(date.toString().slice(16, 24));
        break;
      case 'saturday':
        this.saturdayClockInSet.add(date.toString().slice(16, 24));
        break;
      case 'vocation':
        const temp = date.toString();
        this.vocationDatesSet.add(temp.slice(11, 15) + '-' + DateTransferUtil.monthTransfer(temp.slice(4, 7)) + '-' + temp.slice(8, 10));
        break;
    }
  }

  deleteDate(date, type?: string) {
    switch (type) {
      case 'daily':
        this.dailyClockInSet.delete(date);
        break;
      case 'saturday':
        this.saturdayClockInSet.delete(date);
        break;
      case 'vocation':
        this.vocationDatesSet.delete(date);
        break;
    }
  }

  generateDate() {
    /* 将Set转换为Array，方便遍历*/
    const clockArr = Array.from(this.dailyClockInSet);

    /*如果有输入就用输入，没有就使用默认值 */
    let originDate = this.beginDate ? new Date(this.beginDate).getTime() : new Date('2019-09-30').getTime(); // 对起始日期格式化

    const tempStore = [];

    for (let index = 0; index < this.days; index++) {
      const dd = new Date(originDate);
      originDate = originDate + this.addCount;

      if (dd.getDay() !== 6 && dd.getDay() !== 0 && !this.vocationDatesSet.has(`${dd.getFullYear()}-${dd.getMonth() + 1}
      -0${dd.getDate()}`)) {
        for (let times = 0; times < this.dailyClockInSet.size; times++) {
          tempStore.push(this.formatTime(dd, clockArr[times]).split(' '));
        }
        // for( let times = 0 ;times < 2 ; times++) {
        // tempStore.push( this.formatTime(dd,this.temp_checkingData[times]).split(' '));
      }
    }
    this.printToCSV(tempStore);
  }

  generateDateIncludeSaturday() {
    // 将Set转换为Array，方便遍历
    const clockArr = Array.from(this.dailyClockInSet);
    const satClockArr = Array.from(this.saturdayClockInSet);

    // 临时存储
    const tempStore = [];

    /*如果有输入就用输入，没有就使用默认值 */
    let originDate = this.beginDate ? new Date(this.beginDate).getTime() : new Date('2019-09-30').getTime();

    for (let index = 0; index < this.days; index++) {
      originDate = originDate + this.addCount;
      const dd = new Date(originDate);
      if (dd.getDay() !== 0 && !this.vocationDatesSet.has(`${dd.getFullYear()}-${dd.getMonth() + 1}-0${dd.getDate()}`)) {
        if (dd.getDay() === 6) {
          // 周六打卡记录
          for (let times = 0; times < this.saturdayClockInSet.size; times++) {
            tempStore.push(this.formatTime(dd, satClockArr[times]).split(' '));
          }
        } else {
          // 平日打卡记录
          for (let times = 0; times < this.dailyClockInSet.size; times++) {
            tempStore.push(this.formatTime(dd, clockArr[times]).split(' '));
          }
        }
      }
    }
    this.printToCSV(tempStore);
  }

  printToCSV(arr: Array<any>) {
    let CsvString = '';
    const x = document.createElement('A');
    arr.forEach(RowItem => {
      RowItem.forEach(ColItem => {
        CsvString += ColItem + ',';
      });
      CsvString += '\r\n';
    });
    // \uFEFF 是为了防止中文乱码的BOM头
    CsvString = 'data:application/csv,\uFEFF' + encodeURIComponent(CsvString);
    x.setAttribute('href', CsvString);
    x.setAttribute('download', `${this.id + this.name}.csv`);
    document.body.appendChild(x);
    x.click();
  }

  alert() {
    window.alert('请输入人员ID和生成的天数');
  }

  formatTime(date: Date, data?: any): string {
    return `${this.id} ${date.getFullYear()}.${date.getMonth() >= 9 ? date.getMonth() + 1 :
      '0' + Number(date.getMonth() + 1)}.${date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()} ${data}`;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  openTipsModel() {
    this.isVisible = true;
  }
}
