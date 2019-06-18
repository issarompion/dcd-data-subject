import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientService } from './client.service';

import { ComponentsModule } from './components/components.module';
import { HomeComponent } from './home/home.component'
import { AboutComponent } from './about/about.component'
import { NotificationsComponent } from './notifications/notifications.component'
import { UserComponent } from './user/user.component'

//starter 
import {TransferHttpCacheModule} from '@nguniversal/common';

//stack
import { isPlatformBrowser } from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

//PrimeNG
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {ToolbarModule} from 'primeng/toolbar';
import {CardModule} from 'primeng/card';
import {DialogModule} from 'primeng/dialog';

let imports = [
 //your modules here
];
let declarations = [
 //your declarations here
];

if (isPlatformBrowser) {
  //let CalendarModule = require('primeng/components/calendar/calendar').CalendarModule;
  //imports.push(CalendarModule);
  console.log('Browser platform')
}
else {
  //let CalendarMockComponent = require('./components/primeng/calendarmock.component').CalendarMockComponent;
  //declarations.push(CalendarMockComponent);
  console.log('not Browser platform')
}





@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    NotificationsComponent,
    UserComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'super-app-universal' }),
    AppRoutingModule,
    TransferHttpCacheModule,
    ComponentsModule,
  ],
  providers: [ClientService],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
],
})
export class AppModule { }
