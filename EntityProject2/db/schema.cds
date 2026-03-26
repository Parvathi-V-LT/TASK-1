namespace Hospitaldb;
 
entity Hospital {
    key ID              : String;
        Hospital_name   : String;
        Location        : String;
        Hospital_Type   : String;
        Hospital_Rating : String;
        ContactNo       : String;
 
        RepID           : Composition of many Receptionist
                              on RepID.HosID = $self;
        DeptID          : Composition of many Department
                              on DeptID.HospialID = $self;
 
}
 
entity Department {
    key ID            : String;
        name          : String;
        floor_no      : Integer;
        No_Of_Doctors : Integer;
        No_Of_Nurse   : Integer;
 
        HospialID     : Association to Hospital; //Hospital ID FK
 
        DocID         : Association to many Doctor
                            on DocID.Dept = $self;
        NurID         : Association to many Nurse
                            on NurID.depID = $self;
        WardID        : Association to many Ward
                            on WardID.DepID = $self;
 
}
 
entity Doctor {
    key ID             : String;
        Doctor_name    : String;
        Specialisation : String;
        Experience     : Integer;
        Contant_No     : String;
        Status         : String;
 
        Dept           : Association to Department;
 
        ApptID         : Association to many Appointment
                             on ApptID.docID = $self;
        RecID          : Association to many PatientRecord
                             on RecID.DocID = $self;
        attenance      : Association to many Attenance 
                             on attenance.doctor_Id = $self;
 
}
 
entity Receptionist {
    key ID         : String;
        Name       : String;
        Gender     : String;
        Contant_No : String;
        Shift_Time : String;
        Salary     : Integer;
        Status     : String;
 
        HosID      : Association to Hospital;
        PatID      : Association to many Patient
                         on PatID.RepID = $self; // For Registring....
 
}
 
entity Patient {
    key ID                : String;
        Patient_name      : String;
        Gender            : String;
        Age               : Integer;
        Blood_group       : String;
        Address           : String;
        contact_No        : String;
        Emergency_Contact : String;
        Status            : String; // admitted, discharge, under treatment
 
        AptID             : Composition of many Appointment
                                on AptID.PatID = $self;
        RecID             : Composition of many PatientRecord
                                on RecID.PatID = $self;
 
        RepID             : Association to Receptionist;
 
}
 
 
entity Appointment {
    key ID               : String;
        Date             : Date;
        Time             : Time;
        Status           : String; //booked, completed, cancelled,
        Type             : String;
        Consultation_Fee : Integer;
 
        docID            : Association to Doctor;
        PatID            : Association to Patient;
 
        PresID           : Composition of many Prescription
                               on PresID.AptID = $self;
        LabID            : Composition of many LabTest
                               on LabID.AptID = $self;
        BillID           : Composition of one Billing
                               on BillID.AptID = $self;
 
        RecID            : Association to one PatientRecord
                               on RecID.AptID = $self;
 
}
 
 
entity PatientRecord {
    key ID              : String;
        Diagnosis       : String;
        Prescription    : String;
        Test_Reports    : String;
        Doctor_Notes    : String;
        Visited_Date    : Date;
        Next_Visit_Date : Date;
 
 
        DocID           : Association to Doctor;
        PatID           : Association to Patient;
        AptID           : Association to Appointment;
 
}
 
entity Prescription {
    key ID            : String;
        lineItem      : Association to many PresLineItem
                            on lineItem.prescription = $self;
       
        totalAmount : Integer;
 
 
        //Diagnosis : String;
        //Medicine_Name : String;
        //Prescription_Date : Date;
        //Dosage : String;
 
        AptID         : Association to Appointment;
        LabID           : Association to many LabTest on LabID.PresID = $self;
 
}
 
entity PresLineItem {
    key ID           : String;
        Medicine_Name : String;
        //Dosage        : Integer;
        Frequency     : String; //twice a day
        Duration_Days : Integer;
        Instructions  : String; //After Food/before Food
        quantity     : Integer;
        prescription : Association to Prescription;
        medicine      : Association to Medicine;
}
 
entity Medicine {
    key ID : String;
    Medicine_name : String;
    Cost : Integer;
}
 
entity LabTest {
    key ID          : String;
        Test_name   : String;
        Test_Date   : Date;
        Result      : String;
        Test_Status : String; //ordered, inprogess, completed
        Cost        : Integer;
 
        AptID       : Association to Appointment;
        BillID      : Association to one Billing
                          on BillID.LabID = $self;
        PresID      : Association to Prescription;
 
}
 
entity Billing {
    key ID          : String;
        Date        : Date;
        Amount      : Decimal(10, 2);
        Bill_Status : String; // generated/ closed
 
        AptID       : Association to Appointment;
        PayID       : Composition of many Payment
                          on PayID.BillID = $self;
        LabID       : Association to LabTest;
 
}
 
entity Payment {
    key ID              : String;
        Payment_Mode    : String; //cash/card/UPI
        Payment_Date    : Date;
        Paid_Amount     : Decimal(10, 2);
        Transaction_Ref : String;
        Payment_Status  : String; //success/failed/pending
 
        BillID          : Association to Billing;
 
}
 
entity Nurse {
    key ID         : String;
        Name       : String;
        Contact_No : String;
        Location   : String;
        Shift_Time : Time;
        Experience : Integer;
 
 
        depID      : Association to Department;
}
 
entity Ward {
    key ID                  : String;
        Ward_No             : Integer;
        Ward_Type           : String;
        Availability_of_bed : Integer;
        Total_no_of_bed     : Integer;
        Floor_no            : Integer;
 
        DepID               : Association to Department;
}
 

entity Attenance{
    key ID:String;
    Date:Date;
    status:String;
    doctor_Id:Association to Doctor;
}