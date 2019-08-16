import { Component, OnInit } from '@angular/core';
@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css']
})

export class NotificationsComponent implements OnInit {
  
    notifications : Notifications[] = []

    constructor() {}

    ngOnInit(): void {}

}

export class Notifications {

    id:string
    name: string;
    registred_at: number;
    status :string
    types : string[]
    from : number
    to :  number
  
    constructor(id:string,name:string,registred_at:number,status:string,from:number,to:number){
    
      this.id = id
      this.name = name
      this.registred_at = registred_at
      this.status = status
      this.from = from
      this.to = to
    }
  }