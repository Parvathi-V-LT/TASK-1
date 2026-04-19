const cds = require('@sap/cds')

cds.serve('CatalogService')
  .from('./srv/service.cds')
  .with('./srv/schema.js')
  .in(process.cwd())