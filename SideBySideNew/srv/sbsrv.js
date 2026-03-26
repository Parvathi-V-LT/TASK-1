const cds = require('@sap/cds')

module.exports = cds.service.impl(async function () {
    const { API1, API2 } = this.entities;
    const s4 = await cds.connect.to('API_SCHED_AGRMT_PROCESS_SRV');
   /*  this.on('READ', 'API1', async (req) => {
        const data = await s4.run(SELECT.from('A_SchAgrmtHeader'));
        console.log(data);
        return data;

    }) */

    /*  this.on('READ',API2,async(req)=>{
       const data = await s4.run(req.query);
       console.log(data);
       return data;
      
     }) */
    this.on('READ', API1, async(req) => {
        console.log(req.query);
       
        const bp = await s4.run(req.query);
        console.log(bp);
 
        //console.log("Fetched from sandbox :", bp.length);
 
        const updatedata = await UPSERT.into(API1).entries(bp);
        console.log(updatedata);
       
 
        return bp;
       
    })
})