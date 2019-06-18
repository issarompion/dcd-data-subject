export class Property {
    property_id: string;
    property_name: string;
    property_description: string;
    property_type: string;
    property_dimensions: any[] = [];
    property_values: any[] = [];


    constructor(params : {}) {
            this.property_id = params['property_id']
            this.property_name = params['property_name']
            this.property_description = params['property_description']
            this.property_type = params['property_type'];
            this.property_dimensions = params['property_dimensions'];
            this.property_values = params['property_values'];
    }

    json(){
        return {
            id : this.property_id,
            name : this.property_name,
            type : this.property_type,
            description: this.property_description,
            dimensions: this.property_dimensions,
            value : this.property_values
        }
    }

    update_value(values:any[]){
        this.property_values = values
    }

}

export enum PropertyType{
    ONE_DIMENSION = "1D",
    TWO_DIMENSIONS = "2D",
    THREE_DIMENSIONS = "3D",
    FOUR_DIMENSIONS = "4D",
    FIVE_DIMENSIONS = "5D",
    SIX_DIMENSIONS = "6D",
    SEVEN_DIMENSIONS = "7D",
    EIGHT_DIMENSIONS = "8D",
    NINE_DIMENSIONS = "9D",
    TEN_DIMENSIONS = "10D",
    ELEVEN_DIMENSIONS = "11D",
    TWELVE_DIMENSIONS = "12D",
    ACCELEROMETER = "ACCELEROMETER",
    GYROSCOPE = "GYROSCOPE",
    BINARY = "BINARY",
    MAGNETIC_FIELD = "MAGNETIC_FIELD",
    GRAVITY = "GRAVITY",
    ROTATION_VECTOR = "ROTATION_VECTOR",
    LIGHT = "LIGHT",
    LOCATION = "LOCATION",
    ALTITUDE = "ALTITUDE",
    BEARING = "BEARING",
    SPEED = "SPEED",
    PRESSURE = "PRESSURE",
    PROXIMITY = "PROXIMITY",
    RELATIVE_HUMIDITY = "RELATIVE_HUMIDITY",
    COUNT = "COUNT",
    FORCE = "FORCE",
    TEMPERATURE = "TEMPERATURE",
    STATE = "STATE",
    VIDEO = "VIDEO",
    CLASS = "CLASS"
}
