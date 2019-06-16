import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SubjectComponent } from './subject/subject.component';
import { RedirectionComponent } from './redirection/redirection.component';

import { HttpClientModule} from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router'


//PrimeNG
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {ToolbarModule} from 'primeng/toolbar';
import {CardModule} from 'primeng/card';
import {DialogModule} from 'primeng/dialog';


const appRoutes: Routes = [
  {path: 'redirect', component: RedirectionComponent},
  {path: 'subject', component: SubjectComponent},
  //{path: 'subject/',redirectTo: '/subject', pathMatch: 'full'},
  //{path: '**', redirectTo: '/redirect', pathMatch: 'full'},
  //{path: '', redirectTo: '/redirect', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    SubjectComponent,
    RedirectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    InputTextModule,
    ButtonModule,
    ToolbarModule,
    HttpClientModule,
    CardModule,
    DialogModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
