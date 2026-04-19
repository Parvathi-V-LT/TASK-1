namespace sample.srv;

using { API_PROJECTDEMAND_0001 as s4} from './external/API_PROJECTDEMAND_0001';

service api{
    entity project as projection on s4.A_ProjDmndExpenseDistr;
    function getCountry(pincode:String) returns {
        latitude  : Decimal(10,7);
        longitude : Decimal(10,7);
        state     : String;
        district  : String;
        city      : String;
        town      : String;
    };
}