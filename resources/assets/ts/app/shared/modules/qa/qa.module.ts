import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { PipesModule } from './../../pipes/';
import { SoundCloudModule } from './../../../components';

import { QAComponent } from './qa.component';
import { WSMComponent } from './WSM/WSM.component';
import { WESComponent } from './WES/WES.component';
import { LWSComponent } from './LWS/LWS.component';
import { LSAComponent } from './LSA/LSA.component';
import { LTWComponent } from './LTW/LTW.component';
import { LSBComponent } from './LSB/LSB.component';
import { LCDComponent } from './LCD/LCD.component';
import { LTSComponent } from './LTS/LTS.component';
import { RSAComponent } from './RSA/RSA.component';
import { RMAComponent } from './RMA/RMA.component';
import { RROComponent } from './RRO/RRO.component';
import { RFBComponent } from './RFB/RFB.component';
import { RANComponent } from './RAN/RAN.component';
import { SALComponent } from './SAL/SAL.component';
import { SRSComponent } from './SRS/SRS.component';
import { SPIComponent } from './SPI/SPI.component';
import { SRLComponent } from './SRL/SRL.component';
import { SSAComponent } from './SSA/SSA.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    PipesModule,
    SoundCloudModule
  ],
  declarations: [
    QAComponent,
    WSMComponent,
    WESComponent,
    LWSComponent,
    LSAComponent,
    LTWComponent,
    LSBComponent,
    LCDComponent,
    LTSComponent,
    RSAComponent,
    RMAComponent,
    RROComponent,
    RFBComponent,
    RANComponent,
    SALComponent,
    SRSComponent,
    SPIComponent,
    SRLComponent,
    SSAComponent
  ],
  exports: [
    QAComponent,
    WSMComponent,
    WESComponent,
    LWSComponent,
    LSAComponent,
    LTWComponent,
    LSBComponent,
    LCDComponent,
    LTSComponent,
    RSAComponent,
    RMAComponent,
    RROComponent,
    RFBComponent,
    RANComponent,
    SALComponent,
    SRSComponent,
    SPIComponent,
    SRLComponent,
    SSAComponent
  ]
})
export class QAModule { }
