import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
    declarations: [
    ],
    imports: [
        NzGridModule,
        NzModalModule,
        NzButtonModule,
        NzInputModule,
        CommonModule,
        NzIconModule
    ],
    exports: [
        NzGridModule,
        NzModalModule,
        NzButtonModule,
        NzInputModule,
        CommonModule,
        NzIconModule
    ]
})
export class SharedModule { }