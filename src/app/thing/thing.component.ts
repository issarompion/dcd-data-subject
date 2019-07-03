import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformServer } from "@angular/common";
import { Router} from '@angular/router';
import { Thing,Property } from '.../../../classes'

import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Color,Label } from 'ng2-charts';

@Component({
    //changeDetection: ChangeDetectionStrategy.Default,
    //encapsulation: ViewEncapsulation.Emulated,
    selector: 'app-thing',
    templateUrl: './thing.component.html',
    styleUrls: ['./thing.component.css']
})
export class ThingComponent implements OnInit {

    thing : Thing = new Thing({})
    rangeDates: Date[]
    values:[]
    displayedColumns: string[] = ['name', 'type', 'settings'];

    getValues(rangeDates){
        console.log(rangeDates)
        if(rangeDates.length == 2){
          if(rangeDates[0] !== null && rangeDates[1]!== null){
              console.log('do get')
              const from : number = rangeDates[0].getTime(); 
              const to : number = rangeDates[1].getTime() + 24*60*60*1000 ; 
              console.log('from :',from,'to :',to)
              //this.http.get('/api/things/'+this.ChildThing.thing_id+'/properties/'+this.ChildProperty.property_id+'?from='+from+'&to='+to)
              /*this.http.get('http://localhost:8080/api/things/'+this.thing.thing_id+'/properties/'+this.ChildProperty.property_id+'?from='+from+'&to='+to)
              .toPromise().then(data => {
                console.log('Promise4',data)
                this.values = data['property'].values
                this.showSlider = true
              })*/
  
          }
        }
      }

    //Line chart
    public lineChartData: ChartDataSets[] = [
        { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
      ];
      public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
      public lineChartOptions: ChartOptions = {
        responsive: true,
      };
      public lineChartColors: Color[] = [
        {
          borderColor: 'black',
          backgroundColor: 'rgba(255,0,0,0.3)',
        },
      ];
      public lineChartLegend = true;
      public lineChartType = 'line';
      public lineChartPlugins = [];

    constructor(
        private router: Router,
        //private service: ClientService, 
        //private http: HttpClient,
        @Inject(PLATFORM_ID)
        private platformId: Object) {
    }
    ngOnInit(): void {
        if (isPlatformServer(this.platformId)) {
            console.log('Home component server :'); // host on the server  
        }
        else {
            console.log(history.state.data)
            if(history.state.data === undefined){
                this.router.navigate(['/subject/page/home'])
            }else{
                this.thing = new Thing({
                    thing_id : history.state.data.id,
                    thing_name : history.state.data.id,
                    thing_type : history.state.data.type,
                    thing_description : history.state.data.description,
                    thing_properties : history.state.data.properties
                })
                this.BrowserUniversalInit();
            }
        }
    }
    BrowserUniversalInit() {
        console.log(this.thing)
    }
}
