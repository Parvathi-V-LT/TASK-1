const axios = require('axios');

const USERNAME = 'Paru'; // your confirmed GeoNames username

module.exports = (srv) => {

    srv.on('getDistricts', async (req) => {

        const state = req.data.state;
        if (!state)
          {
         req.error(400, "State is required");
          }
          
        try {
            const response = await axios.get(
                'https://secure.geonames.org/searchJSON',
                {
                    params: {
                        country: 'IN',
                        featureCode: 'ADM2',  // fetch all districts in India
                        maxRows: 1000,        // increase if needed
                        username: USERNAME
                    }
                }
            );

            if (!response.data || !response.data.geonames) {
                req.error(500, "Invalid response from GeoNames API");
            }

            // dynamically filter districts by state
            const districts = response.data.geonames
                .filter(d => d.fcode === 'ADM2' && d.adminName1.toLowerCase() === state.toLowerCase())
                .map(d => d.name);

            if(districts.length === 0) {
                req.error(404, `No districts found for state: ${state}`);
            }

            return districts;

        } catch (error) {
            console.error("GeoNames API call failed:", error.response?.data || error.message);
            req.error(500, "Failed to fetch districts from GeoNames API");
        }

    });

     srv.on('getLocationByPincode', async (req) => {
        const pincode = req.data.pincode;
        if (!pincode) req.error(400, "Pincode is required");

        try {
            const response = await axios.get(
                'https://secure.geonames.org/postalCodeSearchJSON',
                {
                    params: {
                        postalcode: pincode,
                        country: 'IN',
                        maxRows: 1,
                        username: USERNAME
                    }
                }
            );

            if (!response.data || !response.data.postalCodes || response.data.postalCodes.length === 0) {
                req.error(404, `No location found for pincode: ${pincode}`);
            }

            const data = response.data.postalCodes[0];

            return {
                latitude: data.lat,
                longitude: data.lng,
                state: data.adminName1,
                district: data.adminName2 || null,
                city: data.placeName,
                town: data.placeName
            };

        } catch (error) {
            console.error("GeoNames API call failed:", error.response?.data || error.message);
            req.error(500, "Failed to fetch location from GeoNames API");
        }
    });

};