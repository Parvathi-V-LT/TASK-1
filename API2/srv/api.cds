namespace api.srv;

using{API_SALES_CONTRACT_SRV as s4} from './external/API_SALES_CONTRACT_SRV';
using{api.db as db} from '../db/apischema';
service EntityAPI{
    entity sales_contract1 as projection on s4.A_SalesContractItem;
    entity sales_contract2 as projection on db.sales_contract;
}