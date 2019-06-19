import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import { AboutComponent } from './about/about.component'
import { NotificationsComponent } from './notifications/notifications.component'
import { UserComponent } from './user/user.component'
import {NavbarComponent} from './navbar/navbar.component'

import { ClientService } from './client.service';

import {TransferHttpCacheModule} from '@nguniversal/common';

import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    NotificationsComponent,
    UserComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'my-app'}),
    RouterModule.forRoot([
      {path: '', component: HomeComponent, pathMatch: 'full'},
      {path : 'subject/page/user', component : UserComponent, pathMatch: 'full' },
      {path : 'subject/page/about', component : AboutComponent, pathMatch: 'full'},
      {path : 'subject/page/notifications', component : NotificationsComponent, pathMatch: 'full'},
      {path : '**',redirectTo: '',pathMatch: 'full'}
    ]),
    TransferHttpCacheModule,
    MatButtonModule
    //FontAwesomeModule
  ],
  providers: [ClientService],
  bootstrap: [AppComponent]
})
export class AppModule { }
