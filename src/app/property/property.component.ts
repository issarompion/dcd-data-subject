import { Component, Inject,PLATFORM_ID,Input, OnInit} from '@angular/core';

import { Thing, Property,Value, server_url } from '.../../../classes'

import {isPlatformServer} from "@angular/common";

import { ChartDataSets, ChartType, RadialChartOptions,ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

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

    chart_type : string;
    property_data :{}[/*{property_dimension : string,property_unit : string,property_value :  any,property_date:number}*/] = []
    values : any[] = []
    dim_values : Value[] = []
    date : Date
    rangeDates: Date[]
    showSlider : boolean = false
    test :  boolean = true

     //Maps
     lat: number
     lng: number
     key:string = ''
     options
     markers : {}
     
     //Radar Chart
     radarChartOptions: RadialChartOptions
     colors = [{backgroundColor: 'rgba(103, 58, 183, .1)',borderColor: 'rgb(103, 58, 183)',pointBackgroundColor: 'rgb(103, 58, 183)',pointBorderColor: '#fff',pointHoverBackgroundColor: '#fff',pointHoverBorderColor: 'rgba(103, 58, 183, .8)'},];
     radarChartType: ChartType = 'radar';
     radarChartLabels: Label[] = []
     radarChartData: ChartDataSets[];

     //BUBBLE CHART
     view:any[]

     colorScheme = {
       name: 'coolthree',
       selectable: true,
       group: 'Ordinal',
       domain: [
         '#01579b', '#7aa3e5', '#a8385d', '#00bfa5'
       ]
     };
     gradient = false;
     showXAxis = true;
     showYAxis = true;
     showLegend = false;
     showXAxisLabel = true;
     showYAxisLabel = true;
     xAxisLabel = 'date';
     yAxisLabel = 'price';
     yAxisLabel2 = 'count';
     autoScale = true;
     timeLine = true;
     animations = false;
     tooltipDisabled = false;
   
     // data for charts
     multi = [{
       name: 'first',
       series: [{
         name: new Date('2018-01-01T00:00:00'),
         value: '100'
       }, {
         name: new Date('2018-02-01T00:00:00'),
         value: '200'
       }, {
         name: new Date('2018-03-01T00:00:00'),
         value: '150'
       }, {
         name: new Date('2018-04-01T00:00:00'),
         value: '50'
       }, {
         name: new Date('2018-05-01T00:00:00'),
         value: '100'
       }]
     }, {
       name: 'second',
       secondAxis: true,
       series: [{
         name: new Date('2018-01-01T00:00:00'),
         value: '5'
       }, {
         name: new Date('2018-02-01T00:00:00'),
         value: '4'
       }, {
         name: new Date('2018-03-01T00:00:00'),
         value: '1'
       }, {
         name: new Date('2018-04-01T00:00:00'),
         value: '3'
       }, {
         name: new Date('2018-05-01T00:00:00'),
         value: '2'
       }]
     }];

         
     constructor(private http: HttpClient,@Inject(PLATFORM_ID) private platformId: Object,) {}
     
 
     ngOnInit(): void {
         if (isPlatformServer(this.platformId)) {
           //server side
             } else {
              this.BrowserUniversalInit()
           }
     }
 
     BrowserUniversalInit(){
             this.http.get(server_url+'mapsKey')
             .toPromise().then(data => {
               this.key=data['key']
             })
             const to : number = (new Date).getTime();
             const from : number = 0
              this.http.get(server_url+'api/things/'+this.ChildThing.thing_id+'/properties/'+this.ChildProperty.property_id+'?from='+from+'&to='+to)
             .toPromise().then(data => {

              for(var i = 0; i < this.getDimensionSize(this.ChildProperty); i++){
              const dim_name =  this.ChildProperty.property_dimensions[i].name
              const dim_unit = this.ChildProperty.property_dimensions[i].unit
              const index = i
              this.dim_values.push(new Value(
                this.ChildProperty.property_name,
                this.ChildProperty.property_id,
                dim_name,
                dim_unit,
                this.getData(index,data['property'].values)
                ))
              }


               var last_values = []
               if(data['property'].values.length > 0){
                 last_values =  data['property'].values[data['property'].values.length-1]
                 const first_date = new Date(data['property'].values[0][0])
                 const last_date = new Date(data['property'].values[data['property'].values.length-1][0])
                 this.date = last_date
                 this.rangeDates = [first_date,last_date]
                 this.values = data['property'].values
                 this.showSlider = true
               }
             
             switch(this.ChildProperty.property_type) {
                 case "LOCATION": {
                     this.chart_type = "MAPS"
                     //ADD MARKER IN MAPS
                     const last_lat = last_values[1]
                     const last_lng = last_values[2]
                     this.lat = last_lat
                     this.lng = last_lng
                     if(last_lat !== undefined && last_lng !== undefined){
                       this.markers = {
                         markers:  [{
                           lat: last_lat,
                           lng: last_lng,
                           icon: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png',
                           infoWindowOptions: {
                           content: this.ChildThing.thing_name
                           }
                         }],
                         //fitBounds: true,
                         }
                     }
                     this.options = {zoom: 9};
                     //ADD PROPERTY DATA
                     this.property_data.push(
                       {
                       property_dimension : this.ChildProperty.property_dimensions[0].name,
                       property_unit : this.ChildProperty.property_dimensions[0].unit,
                       property_value :  last_lat 
                       },
 
                       {
                         property_dimension : this.ChildProperty.property_dimensions[1].name,
                         property_unit : this.ChildProperty.property_dimensions[1].unit,
                         property_value :  last_lng
                         }
                     )
             //TODO AN UPDATE VALUE WITH HTTP  => use setinterval ?  SOCKET ? MQTT ? 
                     break
                 }
 
               //3D 
               case "TWELVE_DIMENSIONS":
               case "ELEVEN_DIMENSIONS":
               case "TEN_DIMENSIONS":
               case "NINE_DIMENSIONS":
               case "EIGHT_DIMENSIONS":
               case "SEVEN_DIMENSIONS":
               case "SIX_DIMENSIONS":
               case "FIVE_DIMENSIONS":
               case "FOUR_DIMENSIONS":
               case "THREE_DIMENSIONS":
               //case "TWO_DIMENSIONS":
               case "GYROSCOPE":
               case "GRAVITY":
               case "MAGNETIC_FIELD":
               case "GRAVITY":
               case "ROTATION_VECTOR":
               case "ACCELEROMETER" : {
                 this.chart_type = "RADAR"
                 var last_data :  number[] = []
                 var maxvalue : number = 0
                 const dim_size : number = this.getDimensionSize(this.ChildProperty)
                 for(var i = 0; i < dim_size; i++){
                 //GET LAST VALUES
                     const value = last_values[i+1]
                     //ADD LABELS TO CHART
                     this.radarChartLabels.push(this.ChildProperty.property_dimensions[i].name)
                     // ADD LAST VALUES
                     last_data.push(value)
                     //ADD PROPERY DATA
                     this.property_data.push(
                       {
                       property_dimension : this.ChildProperty.property_dimensions[i].name,
                       property_unit : this.ChildProperty.property_dimensions[i].unit,
                       property_value :  value
                       }
                     )
                     if (maxvalue < value){maxvalue = value}
                     if(i == dim_size-1){
                       this.radarChartOptions = {responsive: true,scale: {ticks: {beginAtZero: true,min: 0,max: maxvalue+1,stepSize: 1},}}
                       this.radarChartData = [{data:last_data,label:this.ChildProperty.property_type}]
                     }
                 //TODO AN UPDATE VALUE WITH HTTP  => use setinterval ?  SOCKET ? MQTT ? 
                 }
                 break
             } 
              case "HEART_RATE":
              case "TWO_DIMENSIONS" : { //2 DIMENSIONS
                this.chart_type = "BUBBLE"
                     const dim_size : number = this.getDimensionSize(this.ChildProperty)
                     for(var i = 0; i < dim_size; i++){
                     //GET LAST VALUES
                     const value = last_values[i+1]
                     this.property_data.push(
                       {
                       property_dimension : this.ChildProperty.property_dimensions[i].name,
                       property_unit : this.ChildProperty.property_dimensions[i].unit,
                       property_value :  value
                       }
                     )
                     }
                     break
                 break
             }
                 default: {
                     this.chart_type = "DEFAULT"
                     const dim_size : number = this.getDimensionSize(this.ChildProperty)
                     for(var i = 0; i < dim_size; i++){
                     //GET LAST VALUES
                     const value = last_values[i+1]
                     this.property_data.push(
                       {
                       property_dimension : this.ChildProperty.property_dimensions[i].name,
                       property_unit : this.ChildProperty.property_dimensions[i].unit,
                       property_value :  value
                       }
                     )
                     }
                     break
                 }
      
              }
             })
         }
 

    getData(index,values:[]): {value:number,name:Date}[]{
      var array :  {value:number,name:Date}[] = []
      for(var i = 0; i <= values.length; i++){
        if(i == values.length){
          return array
        }else{
            array.push(
              {
                value: values[i][index+1],
                name: new Date(values[i][0])
              }
            )
        }
      }
    }

    getValues(rangeDates){
      if(rangeDates.length == 2){
        if(rangeDates[0] !== null && rangeDates[1]!== null){
            const from : number = rangeDates[0].getTime(); 
            const to : number = rangeDates[1].getTime() + 24*60*60*1000 ; 
             this.http.get(server_url+'api/things/'+this.ChildThing.thing_id+'/properties/'+this.ChildProperty.property_id+'?from='+from+'&to='+to)
            .toPromise().then(data => {
              this.values = data['property'].values
              this.showSlider = true
            })

        }
      }else{
        this.showSlider = false
      }
    }

    maptest(){
      this.test = !this.test
    }

    handleChange(e) {
      //e.value is the new value (is index)
      const value = this.values[e.value]
      this.date = new Date(value[0])
      var last_data :  number[] = []
      var maxvalue : number = 0
      for(var i = 1; i <= value.length; i++){
        if(i == value.length){
          switch(this.chart_type){
            case "MAPS":
                this.lat = value[1]
                this.lng = value[2]
                this.markers = {
                  markers:  [{
                    lat: value[1],
                    lng: value[2],
                    icon: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png',
                    infoWindowOptions: {
                    content: this.ChildThing.thing_name
                    }
                  }],
                  //fitBounds: true,
                  }
                  this.options = {zoom: 9};
              break
            case "RADAR":
                  this.radarChartData[0].data = last_data
                  this.radarChartOptions.scale.ticks.max = maxvalue + 1
              break
            case "DEFAULT":
              //TODO
              break
          }
        }else{
          this.property_data[i-1]['property_value'] = value[i]
          last_data.push(value[i])
          if (maxvalue < value[i]){maxvalue = value}
        }
      }

  }
   
        getRandomInRange(from, to, fixed) {
          return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
          // .toFixed() returns string, so ' * 1' is a trick to convert to number
      }

      getDimensionSize(property:Property):number{
        var array :  string[] = []
        for(var i = 0; i <= property.property_dimensions.length; i++){
          if(i == property.property_dimensions.length){
            return array.length
          }else{
            if(!array.includes(property.property_dimensions[i].name)){
              array.push(property.property_dimensions[i].name)
            }
          }
        }
      }

}