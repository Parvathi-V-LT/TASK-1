namespace translate.db;

entity emp {
  key ID   : String;
  name     : localized String;
  email    : String;
  dept     : localized String;
}