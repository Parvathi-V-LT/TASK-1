namespace localize.srv;

using {schema.db as db} from '../db/schema';

service localizeAPI {

    entity emp as projection on db.Employees;

}
annotate localizeAPI.emp with @odata.draft.enabled;

