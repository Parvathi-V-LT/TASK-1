namespace sbs.srv;

using {API_SCHED_AGRMT_PROCESS_SRV as s4} from './external/API_SCHED_AGRMT_PROCESS_SRV';
using {sbs.db as db} from '../db/sbs';

service AllApi {
    entity API1 as projection on db.Api1;
    entity orders as projection on db.Purchase_Order;
    //entity API as projection on s4.A_SchAgrmtHeader;
   /*  action LOAD_FROM_S4() returns {
        message : String;
    } */

}
