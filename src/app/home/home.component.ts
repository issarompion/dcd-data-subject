import { Component, OnInit, Injector } from '@angular/core';

import { REQUEST } from '@nguniversal/express-engine/tokens';

import { ClientService } from '../client.service';
import { Thing } from '../../../dcd/entities/thing'
import { Property } from '.../../../dcd/entities/property'
import * as http from '../../../dcd/helpers/http'

import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
  
} from "@angular/common/http";

import {Injectable, Inject, Optional} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";
import {isPlatformServer} from "@angular/common";
import { PLATFORM_ID} from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {

  test:string ='heheh'
  things : Thing[] = []

  //constructor(private service: ClientService, private injector: Injector) { 
  constructor(
    private service: ClientService,
    private http: HttpClient,
    //@Optional() @Inject(REQUEST) private request: any,
    //@Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject('serverUrl') protected serverUrl: string,
    @Optional() @Inject('token') protected token: string
  ) {
    /*if (isPlatformServer(this.platformId)) {
      console.log(this.request); // host on the server
      } else {
      console.log(document.location); // host on the browser
    }*/
    this.serverUrl = serverUrl
    this.token = token
    //this.service.setToken(this.token)
    //console.log(this.serverUrl)
    //console.log(this.token)
    }

    ngOnInit(){
      this.test ='blabla'
      const httpOptions = {headers: new HttpHeaders({ 'accesstoken' : this.token})}; //normaly don't be here...
      this.http.get('http://localhost:8080/api/hello',httpOptions) // normaly we have to use server url...
      //this.http.get(this.serverUrl+'/api/hello',httpOptions) //don't work why ?????
      .subscribe(
        data => {
          console.log(data)
          this.test = data['data']
        }
      )


    }


  
}
