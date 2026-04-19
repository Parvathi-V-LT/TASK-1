 const cds = require('@sap/cds');

module.exports = cds.service.impl(async function (){
    const {emp,customers} = this.entities;

    this.on('getAnnualSal',async(req)=>{
        console.log(req.params[0].ID);
        
        const getData = await SELECT.one.from(customers).where({ID:req.params[0].ID});

        console.log(getData);

        return getData.location;
        
    })

    this.on('getCustomerLocation',async(req)=>{
        console.log(req.data.ID);
        const getData = await SELECT.one.from(customers).where({ID:req.data.ID});

        console.log(getData);

        return getData.location;
        
        
    })

    this.on('updateData',async(req)=>{
        console.log(req.params[0].ID);
        const updateData = await UPDATE(customers).set({location:req.data.location}).where({ID:req.params[0].ID});
    })


    this.on('addEmpCustomer',async(req)=>{
        const{Employee,Customer}= req.data;
        await this.send({event:'addEmp',data:{Employee}});
        await this.send({event:'addCustomer',data:{Customer}});

    })

    this.on('addEmp',async(req)=>{
        console.log("EmployeeData",req.data.Employee);
        const insertData = await INSERT.into(emp).entries(req.data.Employee);
        
        
    })
    this.on('addCustomer',async(req)=>{
        const{Customer}=req.data;
        const insertCust= await INSERT.into(customers).entries(Customer)
    })

    this.on('updateEmp',async(req)=>{
        const {ID,name}= req.data;
        console.log(ID,name);
        const updateData = await UPDATE(emp).set({name:name}).where({ID:ID});

        this.send({event:'updateSal',data:{ID:ID}});
        
    })

    this.on('updateSal',async(req)=>{
        const{ID}=req.data;
        console.log(ID);
        const updateDate = await UPDATE(emp).set({sal:90000}).where({ID:ID});
        
    })

    this.on('customCreateEmp',async(req)=>{
        const {in:records,x} = req.data;
        const created =[];

        for (const r of records){
            const newEntry={
                name:r.name+'_'+x
            };
            await INSERT.into(emp).entries(newEntry);
            created.push(newEntry);
        }
    })
})