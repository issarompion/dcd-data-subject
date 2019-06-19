export class Person {
    //A DCD 'Person' represents a physical person.
    person_id: string;
    person_name: string;
    person_password: string;
    person_properties: any; // Type properties ? json ?
    //json_person :{};

    constructor(
        person_id:string,
        person_name:string,
        person_password:string,
        person_properties:any,
        //json_person:{}
        ) {
        this.person_id = person_id
        this.person_name = person_name
        this.person_password = person_password
        this.person_properties = person_properties
        //this.json_person = json_person
    }
    
    to_json():{}{
        return{
            id:this.person_id,
            name:this.person_name,
            password:this.person_password,
            properties:this.person_properties
        }
    }
}