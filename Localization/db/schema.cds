namespace schema.db;

entity Employees {
  key ID      : String;
      name    : localized String @title : '{i18n>name}';
      email   : localized String @title :'{i18n>email}';
      dept    : localized String @title :'{i18n>dept}';
      salary  : Decimal;
      joining : Date;
}