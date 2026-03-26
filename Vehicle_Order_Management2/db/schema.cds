namespace vehicle.db;

entity Vehicles{
    key Vehicle_ID:String;
    ModelName:String;
    Price:Integer;
    Status:String;
    Order:Composition of many Orders on Order.Vehicle_id=$self;
    Dealer_id:Association to Dealers;
}

entity Dealers{
    key Dealer_ID:String;
    Dealer_Name:String;
    Location:String;
    State:String;
    Vehicle:Association to many Vehicles on Vehicle.Dealer_id=$self;
}

entity Orders{
    key Order_ID:String;
    Quantity:Integer;
    Vehicle_id:Association to Vehicles;
}