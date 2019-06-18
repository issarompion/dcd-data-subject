import { Component } from '@angular/core';
import { ClientService } from './client.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private service: ClientService ) {
   // const req = this._injector.get(REQUEST);
    console.log(service.getToken())
}
}
