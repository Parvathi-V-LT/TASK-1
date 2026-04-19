service api {

    function getLatLong(pincode:String) returns {
        pincode  : String;
        latitude : String;
        longitude: String;
        place:String;
        error : String;
    };

    function getFullDistrict(state:String)returns array of {district:String};

}