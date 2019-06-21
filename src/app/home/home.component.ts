import { Component, OnInit, Injector } from '@angular/core';

import { REQUEST } from '@nguniversal/express-engine/tokens';

import { ClientService } from '../client.service';
import { Thing } from '../../../dcd/entities/thing'
import { Property } from '.../../../dcd/entities/property'


import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";

import {Inject, Optional} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";
import {isPlatformServer} from "@angular/common";
import { PLATFORM_ID} from '@angular/core';

import { ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.Emulated,
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {

  name:string ='No name'
  things : Thing[] = []
  displayedColumns: string[] = ['name', 'type', 'settings'];

  //constructor(private service: ClientService, private injector: Injector) { 
  constructor(
    private service: ClientService, 
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject('serverUrl') protected serverUrl: string,
    @Optional() @Inject('token') protected token: string
  ) {
    if (isPlatformServer(this.platformId)) {
      console.log('Home component server :', this.token,this.serverUrl); // host on the server  
      } else {
       this.BrowserUniversalInit()
    }
    }

    BrowserUniversalInit(){
      this.http.get('/api/hello')
      .subscribe(
        data => {
          console.log(data['data'])
          this.name = data['data']
        }
      )
      
      /*this.http.get('/api/things')
      .toPromise().then(data => {
        console.log(data)
        console.log('Promise resolved.')
      });*/

      this.FillArrayThings(this.things)

      
    }

    FillArrayThings(things : Thing[]) : void{
      this.http.get('/api/things')
      .toPromise().then(data => {
        console.log('promise1 : ',data)
        data['things'].forEach(thing => {
          this.http.get('/api/things/'+thing.id)
        .toPromise().then(data => {
        console.log('promise2',data)
        things.push(new Thing({
          thing_id : data['thing'].id,
          thing_name : data['thing'].name,
          thing_description : data['thing'].description,
          thing_type : data['thing'].type,
          thing_properties : data['thing'].properties
        }))
        });
      });
    }).catch(err => {
      console.log('Error FillArray', err);
    })
    ;
    }


    descriptionT(thing:Thing):string {
      if(thing.thing_description == "" || thing.thing_description === undefined){
        return 'No description available'
      }else{
        return thing.thing_description
      }
    }
  
}
