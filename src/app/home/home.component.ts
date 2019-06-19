import { Component, OnInit, Injector } from '@angular/core';

import { REQUEST } from '@nguniversal/express-engine/tokens';

import { ClientService } from '../client.service';
import { Thing } from '../../../dcd/entities/thing'
import { Property } from '.../../../dcd/entities/property'

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {

  test:string ='heheh'
  things : Thing[] = []

  /*constructor(private service: ClientService, private injector: Injector) { 
    this.service = service;
    let req = this.injector.get(REQUEST);
    this.service.setToken(req.user.accessToken)
    }

  ngOnInit(): void {
    this.service.getData('/things')
    .subscribe(
      data => {
        console.log(this.test)
        this.test ='etetetet'
        console.log('data',data)

      },
      err => {
        //do something
        console.log('ERREUR',err);
      }
    );
  }*/

  
}
