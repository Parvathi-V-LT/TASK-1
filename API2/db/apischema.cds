namespace api.db;

using {API_SALES_CONTRACT_SRV as s4} from '../srv/external/API_SALES_CONTRACT_SRV';

entity sales_contract as projection on  s4.A_SalesContractItem
{
    SalesContract
}