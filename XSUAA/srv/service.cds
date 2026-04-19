namespace xsuaa.srv;

using {xsuaa.db as db} from '../db/schema';

service xsuaaAPI {
    entity customers @(restrict:[{
      grant:'READ',
      to:'XsuaaViewer'
    },
    {
        grant:['CREATE','READ'],
        to:'XsuaaManager'
    },
    {
        grant:'*',
        to:'XsuaaAdmin'
    }]) 
    as projection on db.customer;
}