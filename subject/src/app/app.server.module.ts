// src/app/app.server.module.ts
import { ServerModule } from '@angular/platform-server';
import { NgModule } from '@angular/core';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';
@NgModule({
  declarations: [],
  imports: [
    ServerModule,
    AppModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppServerModule { }