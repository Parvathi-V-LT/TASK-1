namespace emp.srv;

using {emp.db as db} from '../db/schema';
service empAPI{
    entity emp as projection on db.employee actions {
        function getAnnualSal(ID:String) returns String;
        action updateData(ID:String,sal:Integer);
        action customCreateEmp(in : many $self, x:String) returns emp;
        
    }

    entity customers as projection on db.customer;

    function getCustomerLocation(ID:String) returns String;

    action addEmpCustomer(Employee:Array of emp , Customer:Array of customers); 

    action updateEmp(ID:String ,name:String);
    action updateSal(ID:String);

    action customCreate(in : many customers, x:String) returns customers;
}   