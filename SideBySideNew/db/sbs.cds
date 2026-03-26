namespace sbs.db;

using {API_SCHED_AGRMT_PROCESS_SRV as s4} from '../srv/external/API_SCHED_AGRMT_PROCESS_SRV';

@cds.persistence.table
entity Api1 as projection on s4.A_SchAgrmtHeader
{
    SchedulingAgreement,
    CompanyCode,
    PurchasingDocumentCategory,
    PurchasingDocumentType,
    PurchasingGroup,
};

entity Purchase_Order 
{
    key OrderID:String;
    location:String;
    Company_ID:String;
    Company : Association to Api1 on Company.SchedulingAgreement = Company_ID;
}




