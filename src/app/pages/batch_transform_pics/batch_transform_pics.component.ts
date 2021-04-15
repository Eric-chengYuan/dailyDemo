import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-batch-tranform-pics',
  templateUrl: './batch_transform_pics.component.html',
  styleUrls: ['./batch_transform_pics.component.less']
})
export class BatchTransformPicsComponent implements OnInit {

  imgArr = [];
  canvasArr = [];
  idsArr = [];
  height = 287;
  width = 197;

  // tslint:disable-next-line: variable-name
  employee_excel_demo = [
    ['人员ID'], ['0001']
  ];

  test = false;

  // tslint:disable-next-line: variable-name
  pics_suffix = ['png', 'jpg', 'jpeg'];

  constructor(private modal: NzModalService, private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
  }

  uploadExcel(ids) {
    this.test = true;
    const target: DataTransfer = (ids.target) as DataTransfer;
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary', codepage: 936 });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const temp = XLSX.utils.sheet_to_json(ws, { header: 1 });
      // tslint:disable-next-line: object-literal-key-quotes
      temp.forEach((a, index) => {
        if (index > 0) {
          this.idsArr.push({ 'key': a[0], 'value': index });
        }
      });
    };
    reader.readAsBinaryString(target.files[0]);
    // 可以上传同名文件
    ids.target.value = null;
  }

  uploadPics(e) {
    const target: DataTransfer = (e.target) as DataTransfer;
    if (this.imgArr.length > 0) {
      for (const key in target.files) {
        if (target.files.hasOwnProperty(key)
          && this.pics_suffix.find(() => target.files[key].name.split('.')[1])
        ) {
          const element = target.files[key];
          const reader = new FileReader();
          reader.onload = () => {
            const image = new Image();
            image.title = element.name;
            image.src = reader.result.toString();
            this.imgArr = [...this.imgArr, image];
          };
          reader.readAsDataURL(element);
        }
      }
    } else {
      for (const key in target.files) {
        if (target.files.hasOwnProperty(key)) {
          const element = target.files[key];
          const reader = new FileReader();
          reader.onload = () => {
            const image = new Image();
            image.title = element.name;
            image.src = reader.result.toString();
            this.imgArr.push(image);
          };
          reader.readAsDataURL(element);
        }
      }
    }
    setTimeout(() => {
      this.convertImageToCanvas(true);
    }, 1000);
    // 可上传同名文件，即使是多文件上传  因为只记录第一个文件名
    e.target.value = null;
  }

  convertImageToCanvas(check?: boolean) {
    if (this.imgArr.length > 0) {
      if (this.idsArr.length - this.imgArr.length < 0) {
        const len = this.imgArr.length - this.idsArr.length;
        if (check) {
          alert(`上传的图片数量超出excel包含的人员数： ${len}人，`);
          this.imgArr.length = this.idsArr.length;
        }
        for (let t = 0; t < this.idsArr.length; t++) {
          const canvas: any = document.getElementById(this.idsArr[t].value);

          canvas.width = this.width;
          canvas.height = this.height;
          canvas.getContext('2d').drawImage(this.imgArr[t], 0, 0, this.width, this.height);
          // 去掉重复的canvas
          if (!this.canvasArr.find((temp) => temp.id === canvas.id)) {
            this.canvasArr.push(canvas);
          }
        }
      } else {
        this.imgArr.forEach((a, index) => {
          const canvas: any = document.getElementById(this.idsArr[index].value);
          canvas.width = this.width;
          canvas.height = this.height;
          canvas.getContext('2d').drawImage(a, 0, 0, this.width, this.height);
          // 去掉重复的canvas
          if (!this.canvasArr.find((temp) => temp.id === canvas.id)) {
            this.canvasArr.push(canvas);
          }
        });
      }
    }

  }

  convertCanvasToImage() {
    this.canvasArr.forEach((can, index) => {
      const image = new Image();
      image.src = can.toDataURL('image/jpeg');
      console.log(can);
      this.download(image, index, can.id);
    });
  }

  converCanvasToImageOne(e) {
    const tempCanvas = document.getElementById(e);
    this.canvasArr.find((can, index) => {
      if (can.id === tempCanvas.id) {
        const image = new Image();
        image.src = can.toDataURL('image/jpeg');
        this.download(image, index);
      }
    });
  }

  download(image: any, index?: any, canvasId?: string) {
    const target = document.createElement('a');
    const event = new MouseEvent('click');
    // tslint:disable-next-line: no-bitwise
    target.download = canvasId ? canvasId : this.idsArr[index].value;
    // target.download = 'index';
    target.href = image.src;
    target.dispatchEvent(event);
  }

  downloadExcel(type: string) {
    let CsvString = '';
    this.employee_excel_demo.forEach(RowItem => {
      RowItem.forEach(ColItem => {
        CsvString += ColItem + ',';
      });
      CsvString += '\r\n';
    });
    CsvString = 'data:application/csv;charset = utf-8,\uFEFF' + encodeURIComponent(CsvString);
    const x = document.createElement('A');
    x.setAttribute('href', CsvString);
    x.setAttribute('download', `名单.csv`);
    document.body.appendChild(x);
    x.click();
  }
  // 目前是因为input[type = file]的change事件无法直接判断数组长度，所以直接再点击时进行三目判断。
  noEmployeeAlert() {
    window.alert('还未上传员工号，请先点击上传员工号按钮');
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

}
