// src/app/app.server.module.ts
import { ServerModule } from '@angular/platform-server';
import { NgModule } from '@angular/core';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';

//tuto
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
//universal starter
import {ServerTransferStateModule} from '@angular/platform-server';
import {ModuleMapLoaderModule} from '@nguniversal/module-map-ngfactory-loader';

@NgModule({
  declarations: [],
  imports: [
    ServerModule,
    AppModule,
    NoopAnimationsModule,
    ModuleMapLoaderModule,
    ServerTransferStateModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppServerModule { }