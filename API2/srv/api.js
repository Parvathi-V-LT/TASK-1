const cds = require('@sap/cds');

module.exports = cds.service.impl(async function()
{
    const s4System = await cds.connect.to('API_SALES_CONTRACT_SRV');
    const {sales_contract1,sales_contract2} = this.entities;

    this.on('READ',sales_contract1,async(req)=>{
        console.log(req.query);
        const sales = await s4System.run(req.query);
        console.log(sales);
        return sales;
        
        
    })

    this.on('READ',sales_contract2,async(req)=>{
        console.log(req.query);
        const sales = await s4System.run(req.query);
        console.log(sales);
        return sales;
        
        
    })
})