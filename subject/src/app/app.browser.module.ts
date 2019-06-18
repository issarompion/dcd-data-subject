// src/app/app.browser.module.ts
//import { BrowserModule } from '@angular/platform-browser';
import { HttpClientXsrfModule} from '@angular/common/http'
import { NgModule } from '@angular/core';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';


import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {ToolbarModule} from 'primeng/toolbar';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {DialogModule} from 'primeng/dialog';

@NgModule({
    imports: [
        AppModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'csrftoken',
            headerName: 'X-CSRFToken'
 }),
    
    BrowserModule,
    /*BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    InputTextModule,
    ButtonModule,
    ToolbarModule,
    CardModule,
    DialogModule,*/
 
],
    bootstrap: [AppComponent]
})
export class AppBrowserModule {
}