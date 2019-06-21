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

  things : Thing[] = []
  displayedColumns: string[] = ['name', 'type', 'settings'];
  //Dialog property
  display_property: boolean = false;
  property_picked:Property = new Property({})

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
      this.FillArrayThings(this.things)

      
    }

    FillArrayThings(things : Thing[]) : void{
      //this.http.get('/api/things')
      this.http.get('http://localhost:8080/api/things')
      .toPromise().then(data => {
        console.log('promise1 : ',data)
        data['things'].forEach(thing => {
          //this.http.get('/api/things/'+thing.id)
          this.http.get('http://localhost:8080/api/things/'+thing.id)
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

    sort_things_by_properties(things : Thing[]) : Thing[] {

      return []
    }

    descriptionT(thing:Thing):string {
      if(thing.thing_description == "" || thing.thing_description === undefined){
        return 'No description available'
      }else{
        return thing.thing_description
      }
    }

    descriptionP(property:Property):string {
      if(property.property_description == "" || property.property_description === undefined ){
        return 'No description available'
      }else{
        return property.property_description 
      }
    }

    HasProperty(thing:Thing):boolean{
      return thing.thing_properties.length > 0
    }

    showDialog_property(property : Property) {
        this.property_picked = property
        this.display_property = true;
    }
  
}
