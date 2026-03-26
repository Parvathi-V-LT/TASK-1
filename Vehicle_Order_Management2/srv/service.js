const cds = require('@sap/cds');
const { INSERT, SELECT } = require('@sap/cds/lib/ql/cds-ql');

module.exports = cds.service.impl(async function () {
    const { orders, dealers, vehicles } = this.entities;

    this.before('CREATE', vehicles, async (req) => {
        if (!req.data.Dealer_id_Dealer_ID) {
            req.error("Please give the dealer id");
        }
        /*  else if (!req.data.Vehicle_ID.startsWith('TN') && !req.data.Vehicle_ID.startsWith('KA')) {
             req.error("Please give Proper Vehicle ID")
         } */
    })
    this.before('CREATE', orders, async (req) => {
        if (!req.data.Vehicle_id_Vehicle_ID) {
            req.error("Please give the vehicle id")
        }
        else if (!req.data.Vehicle_id_Vehicle_ID.startsWith('TN') && !req.data.Vehicle_id_Vehicle_ID.startsWith('KA')) {
            req.error("Please give Proper Vehicle ID")
        }
    })

    this.before('CREATE', dealers, async (req) => {
        if (!req.data.Dealer_ID) {
            req.error("Please give the dealer id")
        }
    })


    this.on('CREATE', vehicles, async (req) => {
        const { Dealer_id } = req.data;
        console.log(Dealer_id.Dealer_ID);

        const selectDealer = await SELECT.from(dealers).where({ Dealer_ID: Dealer_id.Dealer_ID })
        console.log(selectDealer);

        const StateOfDealer = {
            "TamilNadu": "TN",
            "Karnataka": "KA",
            "Kerala": "KE",
            "Pondycherry": "PY"
        }

        const StateLetter = StateOfDealer[selectDealer[0].State]
        console.log(StateLetter);
        req.data.Vehicle_ID = StateLetter + req.data.Vehicle_ID;
        console.log(req.data.Vehicle_ID);
        req.data.Status = 'Not Applicable';
        const insertVehicle = await INSERT.into(vehicles).entries(req.data);
        const data = await SELECT.from(vehicles).where({ Vehicle_ID: req.data.Vehicle_ID });
        console.log(data);



    })

    this.on('CREATE', orders, async (req) => {
        const insertOrder = await INSERT.into(orders).entries(req.data);
        const data2 = await SELECT.from(orders).where({ Order_ID: req.data.Order_ID });
        console.log(data2);
    })

    this.on('CREATE', dealers, async (req) => {
        const insertDealer = await INSERT.into(dealers).entries(req.data);
        const data3 = await SELECT.from(dealers).where({ Dealer_ID: req.data.Dealer_ID });
        console.log(data3);
    })

    this.after('CREATE', vehicles, async (req, data) => {
        data.message = "Vehicle Successfully created"
    })

    this.after('CREATE', orders, async (req, data) => {
        data.message = "Order Successfully created"
    })

    this.after('CREATE', dealers, async (req, data) => {
        data.message = "Dealer Successfully created"
    })

    this.on('approveVehicle', async (req) => {
        const { Vehicle_ID } = req.data;
        console.log(Vehicle_ID);

        const updateVehicle = await UPDATE(vehicles).set({ Status: 'Approved' }).where({ Vehicle_ID: Vehicle_ID });
        console.log(updateVehicle);

        return "Vehicle is Approved";
    })

    this.on('getTotalOrderValue', async (req) => {
        const { Vehicle_ID } = req.data;
        console.log(Vehicle_ID);

        const vehicleData = await SELECT.from(vehicles).where({ Vehicle_ID: Vehicle_ID });
        const orderData = await SELECT.from(orders).where({ Vehicle_id_Vehicle_ID: Vehicle_ID });
        
         const StateOfDealer = {
           "TN":100,
           "KA":200,
           "KE":300,
           "PY":50
        }
        console.log(vehicleData);
        console.log(orderData);
            const FilterState = StateOfDealer[vehicleData[0].Vehicle_ID.substring(0,2)];
            console.log(FilterState);
            
            const TotalOrderValue = (vehicleData[0].Price * orderData[0].Quantity) + (FilterState* orderData[0].Quantity);
            console.log(TotalOrderValue);
            return TotalOrderValue


    })
})


//http://localhost:4004/odata/v4/vehicle-api/getTotalOrderValue(Vehicle_ID='TN001')

/* {
     "Vehicle_ID": "3",
     "ModelName": "Yamaha",
     "Price": 50000,
     "Dealer_id": {"Dealer_ID":"1"}
   } */


//    {
//   "Dealer_ID": "3",
//   "Dealer_Name": "Amla",
//   "Location": "Chennai",
//   "State": "TamilNadu"
// }


//  {
//   "Order_ID": "2",
//   "Quantity": 5,
//   "Vehicle_id_Vehicle_ID": "TN2"
// }