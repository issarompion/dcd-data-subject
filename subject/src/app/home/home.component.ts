import { Component } from '@angular/core';

import { ClientService } from '../client.service';
import { Injector } from '@angular/core';
import { REQUEST } from '@nguniversal/express-engine/tokens';

import * as http from '../../dcd/helpers/http'
import { Thing } from '../../dcd/entities/thing'
import { Property } from '../../dcd/entities/property'

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {

  id : string
  name : string
  email : string
  things : Thing[] = []

    //Show the optional carac 
    descriptionT(thing:Thing):string {
      if(thing.thing_description == "" || thing.thing_description === undefined){
        return 'No description available'
      }else{
        return thing.thing_description
      }
    }
    typeT(thing:Thing):string {
      if(thing.thing_type == ""|| thing.thing_type === undefined ){
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

      //Dialog property
    display_properties: boolean = false;
    title_properties : string = "properties";
    properties : Property[] = []

    showDialog_properties(thing : Thing) {
      if(thing.thing_properties.length == 0){
        //do something 
        console.log('empty')
      }else {
        console.log(thing.thing_properties)
      }
        this.display_properties = true;
        this.title_properties = thing.thing_name +' properties'
        this.properties = thing.thing_properties
  
    }
  
  
    //Dialog edit
    display_edit: boolean = false;
  
    showDialog_edit() {
        this.display_edit= true;
    }

    constructor(private service: ClientService, private _injector: Injector) {
      const req = this._injector.get(REQUEST);
      this.service.setToken(req.user.accessToken) 
     }

     ngOnInit(){
       console.log(this.service.getToken())
       /*if(this.service.getToken() === undefined){
         console.log('it should be impossible')
       }else{
         console.log('perfect')
       }*/

       /*if(this.service.getToken() === undefined){
         console.log('it should be impossible')
       }else{
         console.log('perfect')
       }*/

       const token = this.service.getToken()

        /*http.RetrieveUserId(token)
       .then((body) =>{
         console.log('body',body)
         console.log(body.sub.split('dcd:persons:')[1])
         this.id = body.sub.split('dcd:persons:')[1]
         this.email = body.sub.split('dcd:persons:')[1]
         http.RetrieveUserInfo(token,body.sub.split('dcd:persons:')[1])
         .then((body) => {
           this.name = body.person.name
         })
       }
       )
       .catch(err => {
         //do something if an error occured
         //this.router.navigate(['redirect'])
         console.log('err',err)
       }
         );*/

      //.env
      this.service.getData('https://dwd.tudelft.nl/userinfo')
      .subscribe(
        data => {
          this.id = data.sub.split('dcd:persons:')[1]
          this.email = data.sub.split('dcd:persons:')[1]
          http.RetrieveUserInfo(token,data.sub.split('dcd:persons:')[1])
          .then((body) => {
            this.name = body.person.name
          })
        },
        err => {
          console.log('err',err);
        }
      );
         
       this.FillArrayThings(this.things,token)
     }

     // le tableau doit être initialisé et vide
    FillArrayThings(things : Thing[],authorization : string) : void{
    http.RetrieveThings(authorization)
    .then((body) => {
      body.things.forEach(thing => {
      http.RetrieveThing(authorization,thing.id)
      .then((body) => {
        things.push(new Thing({
          thing_id : body.thing.id,
          thing_name : body.thing.name,
          thing_description : body.thing.description,
          thing_type : body.thing.type,
          thing_properties : body.thing.properties
          }))
        })
      });
    })
    .catch(err => console.log('eer',err));
  }
}
