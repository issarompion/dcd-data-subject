import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ClientService } from './client.service';

import { ComponentsModule } from './components/components.module';

import { isPlatformBrowser } from '@angular/common';

//PrimeNG
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {ToolbarModule} from 'primeng/toolbar';
import {CardModule} from 'primeng/card';
import {DialogModule} from 'primeng/dialog';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'super-app-universal' }),
    AppRoutingModule,
    ComponentsModule,
    ToolbarModule
  ],
  providers: [ClientService],
  bootstrap: [AppComponent]
})
export class AppModule { }
