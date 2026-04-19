using {translate.db as db } from '../db/schema';

service EmpService {

  entity emp as projection on db.emp;

}