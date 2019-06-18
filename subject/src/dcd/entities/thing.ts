import { Property } from './property'
import  * as http from '../helpers/http'

interface IThing {
    thing_id : string;
    thing_token : string
}
export class Thing implements IThing {
    thing_id: string;
    thing_token: string;
    thing_name: string;
    thing_description: string;
    thing_type: string
    thing_properties: Property[] = [];

    constructor(params : {}) {
        this.thing_id = params['thing_id']
        this.thing_token = params['thing_token']
        this.thing_name = params['thing_name']
        this.thing_description = params['thing_description']
        this.thing_type = params['thing_type']
        
        if(params['thing_properties'] instanceof Array){
            params['thing_properties'].forEach(property => {
                if(property instanceof Property){
                    this.thing_properties.push(property)
                }else{
                    if(property.constructor === {}.constructor){
                        this.thing_properties.push(new Property({
                            property_id :property['id'],
                            property_name : property['name'],
                            property_description : property['description'],
                            property_type : property['type'],
                            property_dimensions : property['dimensions'],
                            property_values : property['values']
                        }
                        ))
                    }
                }
            })
        }
    }

    read(){
        http.RetrieveThing(this.thing_token,this.thing_id)
        .then((body) => {
            this.thing_name = body.thing.name
            this.thing_description = body.thing.description
            this.thing_type =  body.thing.type
            this.update_properties(this.array_to_properties(body.thing.properties)) // this has to be update_property : check if a property exist
        })
    }
    json(){
    return {
        id : this.thing_id,
        name : this.thing_name,
        type : this.thing_type,
        description: this.thing_description,
        properties : this.properties_to_array()
    }
    }

    //create a callback function
    private properties_to_array():Array<any>{
        var res = []
        for (var i = 0; i <= this.thing_properties.length; i ++) {
            if(i < this.thing_properties.length){
                const property = this.thing_properties[i]
                res.push(property.json())
            }else{
                return res
            }
          }
    }

    private array_to_properties(array:Array<any>):Array<Property>{
        var res = []
        for (var i = 0; i <= array.length; i ++) {
            if(i < array.length){
                const property = array[i]
                if(property.constructor === {}.constructor){
                res.push(new Property({
                    property_id :   property.id,
                    property_name : property.name,
                    property_description : property.description,
                    property_type : property.type,
                    property_dimensions : property.dimensions,
                    property_values : property.values
                }))
                }
           }else{
            return res
            }
        }
    }


    private update_properties(properties:Array<Property>){
        properties.forEach(property => {
                    if(!this.contains(property.property_id)){
                        this.thing_properties.push(property)
                    }else{
                        console.log(property.property_id,'already there')
                    }
        })
    }

    private contains(property_id:string):boolean{
        var res = false
        for (var i = 0; i <= this.thing_properties.length; i ++) {
            if(i < this.thing_properties.length){
                if(property_id == this.thing_properties[i].property_id){
                    res = true
                }
            }else{
                return res
            }
          }
    }
}


//TODO : throw les erreurs à la construction.