// src/app/app.browser.module.ts
//import { BrowserModule } from '@angular/platform-browser';
import { HttpClientXsrfModule} from '@angular/common/http'
import { NgModule } from '@angular/core';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
    imports: [
        AppModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'csrftoken',
            headerName: 'X-CSRFToken'
 }),
    ],
    bootstrap: [AppComponent]
})
export class AppBrowserModule {
}