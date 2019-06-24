import { Component, Inject, Optional,PLATFORM_ID,Input, OnInit} from '@angular/core';
import { Thing } from '../../../dcd/entities/thing'
import { Property, PropertyType } from '.../../../dcd/entities/property'

import { ClientService } from '../client.service';
import {isPlatformServer} from "@angular/common";

import {
    HttpClient,
    HttpHeaders,
    HttpErrorResponse,
    HttpParams,
  } from "@angular/common/http";

@Component({
    selector: 'app-property',
    templateUrl: './property.component.html',
    styleUrls: ['./property.component.css']
})

export class PropertyComponent implements OnInit {

    @Input() ChildThing: Thing;
    @Input() ChildProperty: Property;

    ngOnInit(): void {
        if (isPlatformServer(this.platformId)) {
            console.log('Property component server')
            console.log('childT',this.ChildThing)
              console.log('childP',this.ChildProperty)  
            } else {
             this.BrowserUniversalInit()
          }
    }

    property_type : string;

    //Maps
    lat: number = 51.678418;
    lng: number = 7.809007;
    key:string = 'AIzaSyD6TYz32l0J6kFrPTapRm2z5RwGxBBKbFA'
    markers =  {
            markers:  [{
                lat: 43.073051,
                lng: -89.401230,
                icon: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png',
                infoWindowOptions: {
                  content: "TODO"
                }
                }],
            fitBounds: true
          }
        
    
    constructor(
        private service: ClientService, 
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object,
      ) {
        }
    
        BrowserUniversalInit(){
            console.log('childT',this.ChildThing)
            console.log('childP',this.ChildProperty) 

            this.property_type = this.ChildProperty.property_type
            
            switch(this.ChildProperty.property_type) {
                case PropertyType.LOCATION: {
                    console.log(PropertyType.LOCATION)
                    break
                }
                default: {
                   
                    break
                }
     
             }
        }

}