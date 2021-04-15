import { Component, OnInit, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-over-date',
  templateUrl: './over-date.component.html',
  styleUrls: ['./over-date.component.less']
})
export class OverDateComponent implements OnInit {

  // 除开表头的数据
  storeData = [];
  // 上传的数据源
  uploadData = [];
  // 表头名称
  table_header = [];
  // 记录已经超时的员工
  employee_over_time = new Map();
  // 选中的超期员工
  select_employees_over_time = new Set();
  // 用于搜索的copy数组
  copyData = [];
  // 控制抽屉的开合
  visible_drawer = false;
  // sap的示范excel
  sap_excel_demo = [];


  constructor(private modal: NzModalService, private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
  }



  // 上传excel文档
  onFileChange(evt: any, type?: string) {
    /* wire up file reader */
    // tslint:disable-next-line: no-angle-bracket-type-assertion
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const temp = XLSX.utils.sheet_to_json(ws, { header: 1 });
      this.uploadData = JSON.parse(JSON.stringify(temp));
      this.upload_excel_from_sap();
    };
    reader.readAsBinaryString(target.files[0]);
  }

  // 将 SAP 考勤汇总报表转置后进行查看 【表头和表数据的第一次处理】
  upload_excel_from_sap() {
    this.storeData = [];
    this.employee_over_time = new Map();
    // 以下四个对应四个关键数据列
    let date = null;
    let number = null;
    let time = null;
    let name = null;

    // 因为表头需要去重所以此处使用Set结构
    const tempHeader = new Set().add('人员');

    // 使用map 主要是一个人对应多个考勤日期  使用一对多的结构比较方便  ES5版本还在增强中
    const employeeMap = new Map();

    // 抽取出各自的index作为下方整理数据的索引
    for (let i = 0; i < this.uploadData[0].length; i++) {
      switch (this.uploadData[0][i]) {
        case '考勤日期':
          date = i;
          break;
        case '人员编码':
          number = i;
          break;
        case '实际出勤时数':
          time = i;
          break;
        case '姓名':
          name = i;
          break;
        default:
          break;
      }
    }

    for (let j = 1; j < this.uploadData.length; j++) {
      /* excel是从19000101开始，js时19700101开始计算，两者相减天数为25569，excel中日期格式的值为19000101到对应日期的天数。
         因为从系统导出的考勤明细永远是一个区间，所以在遍历的时候直接天数递增即可。
         另外一种方案是模拟最大的天数，然后预生成一个空间来存放：未实现。
      */
      const tempDate = new Date((this.uploadData[j][date] - 25569) * 60 * 60 * 24 * 1000);
      tempHeader.add(`${tempDate.getFullYear()}-${(tempDate.getMonth() + 1)}-${tempDate.getDate()}`);

      // 判断如果该员工和日期是第一次出现，就在map中新增一项，key: 员工号， value: 每日考勤数据
      if (employeeMap.has(this.uploadData[j][number] + this.uploadData[j][name])) {
        employeeMap.get(this.uploadData[j][number] + this.uploadData[j][name]).push(this.uploadData[j][time]);
      } else {
        employeeMap.set(`${this.uploadData[j][number] + this.uploadData[j][name]}`, [this.uploadData[j][time]]);
      }
    }
    this.table_header = [...tempHeader];
    employeeMap.forEach((a, key) => {
      // 输出结果类似于 [0001, 8,0,8,0,8,8,8,8,8]
      this.storeData.push([key, ...a]);
    });
    this.data_op_sap();
  }

  // 对整理好的sap报表数据进行二次处理
  data_op_sap() {
    const len = this.storeData.length;
    let count = null;
    for (let i = 0; i < len; i++) {
      count = 0;
      this.storeData[i].forEach((temp, index) => {
        // 第一列为员工号，后续有变动只需变更index即可
        if (index > 0) {
          if (temp === 0) {
            count = 0;
            this.storeData[i][index] = 0;
          } else {
            count++;
            this.storeData[i][index] = count;
            if (count > 6) {
              this.employee_over_time.set(this.storeData[i][0],this.storeData[i][0]);
            }
          }
        }
      });
    }
    this.copyData = [...this.storeData];
  }

  filterFn() {
    let tempArr = [];
    this.copyData.forEach(c => {
      if(this.employee_over_time.has(c[0])) {
        tempArr.push(c);
      }
    });
    this.storeData = [...tempArr];
  }

  findAll() {
    this.storeData =[...this.copyData];
  }

  downloadExcel(type: string) {
    this.sap_excel_demo = [];
    this.mockData();
    let CsvString = '';
    if (type && type === 'sap_demo') {
      this.sap_excel_demo.forEach(RowItem => {
        RowItem.forEach(ColItem => {
          CsvString += ColItem + ',';
        });
        CsvString += '\r\n';
        XLSX.writeFile
      });
    }
    CsvString = 'data:application/csv;charset=utf-8,\uFEFF' + encodeURIComponent(CsvString);
    const x = document.createElement('A');
    x.setAttribute('href', CsvString);
    x.setAttribute('download', `每日考勤模板数据.csv`);
    document.body.appendChild(x);
    x.click();
  }

  createTplModal(tplTitle: TemplateRef<{}>, tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>): void {
    this.modal.create({
      nzTitle: tplTitle,
      nzContent: tplContent,
      nzFooter: tplFooter,
      nzMaskClosable: false,
      nzClosable: false,
      nzComponentParams: {
        value: 'Template Context'
      },
      nzOnOk: () => console.log('Click ok')
    });
  }

  mockData() {
    this.sap_excel_demo.push(['人员编码', '姓名', '考勤日期', '实际出勤时数']);
    const employeeName = ['', '小明', '小红', '小刚', '小李', '小黑']
    for (let i = 1; i < 6; i++) {
      for (let j = 1; j < 31; j++) {
        const temp = Math.random() * 10;
        this.sap_excel_demo.push([
          '100'+i.toString(),
          employeeName[i],
          `2020-10-${j}`,
          temp > 3 ? temp.toFixed(0).toString() : '0'
        ]);
      }
    }
  }
}
