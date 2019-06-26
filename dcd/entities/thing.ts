import { Property } from './property'
import { PropertyType } from '../entities/property'
import  * as http from '../helpers/http'

const api_url = 'https://dwd.tudelft.nl/api'

export class Thing {
     thing_id: string;
     thing_token: string;
     thing_name: string;
     thing_description: string;
     thing_type: string
     thing_properties: Property[] = [];
    
    constructor(params : {}) {
        if(params === undefined){
            throw new TypeError('Thing : constructor param is undefined')
        }else{
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
    }

    async read(): Promise<void>{
        const result = await http.GETRequest(api_url+'/things/'+this.thing_id,this.thing_token)
        if(result.thing === undefined){
            throw new TypeError('body is undifined : no thing found, check if the id and token of your thing are valid')
        }else{
            this.thing_name = result.thing['name']
            this.thing_description = result.thing['description']
            this.thing_type =  result.thing['type']
            this.update_properties(this.array_to_properties(result.thing.properties)) // this has to be update_property : check if a property exist
            return
        }
    }

    json():{}{
        return {
        id : this.thing_id,
        name : this.thing_name,
        type : this.thing_type,
        description: this.thing_description,
        properties : this.properties_to_array()
        }
    }

    async find_or_create_property(property_name:string,property_type:PropertyType):Promise<Property>{
        if(this.find_property_by_name(property_name) == undefined){
            const res = await this.create_property(property_name,property_type)
            return res;
        }else{
            return this.find_property_by_name(property_name)
        }
    }

    private async create_property(property_name:string,property_type:PropertyType):Promise<Property>{
        var prop = new Property({
            property_name : property_name,
            property_type : property_type,
        })
        const result = await http.POSTRequest(api_url+'/things/'+this.thing_id+'/properties',this.thing_token,prop.json())
        const prop_res : Property = new Property({
            property_id :   result.property.id,
            property_name : result.property.name,
            property_description : result.property.description,
            property_type : result.property.type,
            property_dimensions : result.property.dimensions,
            property_values : result.property.values
        })
        this.thing_properties.push(prop_res)
        return prop_res
    }

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
        for (var i = 0; i <= this.thing_properties.length; i ++) {
            if(i < this.thing_properties.length){
                if(property_id == this.thing_properties[i].property_id){
                    return true
                }
            }else{
                return false
            }
          }
    }

    private find_property_by_name(property_name:string): Property{
        var res : Property;
        for (var i = 0; i <= this.thing_properties.length; i ++) {
            if(i < this.thing_properties.length){
                if(property_name == this.thing_properties[i].property_name){
                    //res = this.thing_properties[i]
                    return this.thing_properties[i]
                }
            }else{
                return res
            }
          }
    }
}


//TODO : throw les erreurs à la construction.