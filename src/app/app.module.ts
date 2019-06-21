import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

//Components
import {  AppComponent  } from './app.component';
import {  HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component'
import { NotificationsComponent } from './notifications/notifications.component'
import { UserComponent } from './user/user.component'
import {  NavbarComponent } from './navbar/navbar.component'

//Http
import { ClientService } from './client.service';
import {  HttpClientModule  } from '@angular/common/http';
import {  TransferHttpCacheModule } from '@nguniversal/common';

// MatUI
import {MatButtonModule} from '@angular/material/button';

//PrimeNG
import {CardModule} from 'primeng/card';
import {DialogModule} from 'primeng/dialog';

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
      {path : 'subject/page/home', component : HomeComponent, pathMatch: 'full' },
      {path : 'subject/page/user', component : UserComponent, pathMatch: 'full' },
      {path : 'subject/page/about', component : AboutComponent, pathMatch: 'full'},
      {path : 'subject/page/notifications', component : NotificationsComponent, pathMatch: 'full'},
      {path : '**',redirectTo: '/subject/page/home',pathMatch: 'full'}
    ]),
    TransferHttpCacheModule,
    MatButtonModule,
    HttpClientModule, //VERY IMPORTANT
    //CardModule,
    //DialogModule
  ],
  providers: [
    ClientService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
