import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component'
import { AboutComponent } from './about/about.component'
import { NotificationsComponent } from './notifications/notifications.component'
import { UserComponent } from './user/user.component'

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full'},
  {path : 'subject/page/user', component : UserComponent, pathMatch: 'full' },
  {path : 'subject/page/about', component : AboutComponent, pathMatch: 'full'},
  {path : 'subject/page/notifications', component : NotificationsComponent, pathMatch: 'full'},
  { path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
