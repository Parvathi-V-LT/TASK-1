const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
    const {project,resourceAssignment}=this.entities;
    const s4 = await cds.connect.to('API_PROJECTDEMAND_0001');
    const location = await cds.connect.to('location');

    this.on('READ', project, async (req) => {
        const dest = await s4.run(req.query);
        return dest;
    });

    this.on('READ', 'resourceAssignment', async (req) => {
        const dest = await s4.run(req.query);
        return dest;
    });

    this.on('getCountry',async(req)=>{
           const {pincode} =req.data;
           console.log(pincode);
           
            const response = await location.get(`/postalCodeSearchJSON?postalcode=${pincode}&country=IN&maxRows=1&username=paru`);
            console.log(response);
            const data = response.postalCodes[0]

            console.log("Data",data);
            
            return {
                latitude: data.lat,
                longitude: data.lng,
                state: data.adminName1,
                district: data.adminName2 || null,
                city: data.placeName,
                town: data.placeName
            };

        
    })

});