namespace vehicle.srv;
using {vehicle.db as db} from '../db/schema';

service VehicleApi{
    entity vehicles as projection on db.Vehicles;
    action approveVehicle(Vehicle_ID:String) returns String;
    function getTotalOrderValue(Vehicle_ID:String)returns Integer;

}


//service SecureDetails
//{
//        entity orders as projection on db.Orders;
 //       entity dealers as projection on db.Dealers;
//}
//annotate SecureDetails with @(requires:'admin')