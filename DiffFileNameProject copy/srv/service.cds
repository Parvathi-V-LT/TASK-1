using { my.bookshop as db } from '../db/schema';

service CatalogService @(impl:'./schema.js') {
  entity Books as projection on db.Books;
}