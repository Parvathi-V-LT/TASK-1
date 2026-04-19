service LocationService {

    // Districts action: returns an array of district names for a given state
    function getDistricts(state : String) returns Array of String;

    // Location by pincode action: returns detailed info for a given pincode
    function getLocationByPincode(pincode : String) returns {
        latitude  : Decimal(10,7);
        longitude : Decimal(10,7);
        state     : String;
        district  : String;
        city      : String;
        town      : String;
    };

}