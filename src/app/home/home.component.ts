import { Component, Inject,PLATFORM_ID, OnInit} from '@angular/core';
import {isPlatformServer} from "@angular/common";
import {HttpClientService,Thing} from '@datacentricdesign/ui-angular'

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  things : Thing[] = []

  constructor(@Inject(
    PLATFORM_ID) private platformId: Object,
    private service: HttpClientService
  ) {}

    ngOnInit(): void {
      if (isPlatformServer(this.platformId)) {
        console.log('Init Home component server'); // host on the server 
        } else {
         this.BrowserUniversalInit()
      }
    }

    BrowserUniversalInit(){
      console.log('Init Home component browser')
      this.FillArrayThings()
    }

    FillArrayThings() : void{
      this.service.get('api/things').subscribe(
        data => {
        data['things'].forEach(thing => {
          this.service.get('api/things/'+thing.id).subscribe(
        data => {
        this.things.push(new Thing(data['thing']))
        });
      });
    })
    ;
    }

  }