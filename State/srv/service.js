const cds = require('@sap/cds');
const axios = require('axios');

module.exports = cds.service.impl(async function () {

    this.on('getFullDistrict', async (req) => {
        const stateName = req.data.state;
        if (!stateName) {
            req.error("Please provide the state");
            return;
        }

        try {
            const axios = require('axios');

            // Step 1: Get the state OSM relation ID from Nominatim
            const stateRes = await axios.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: `${stateName}, India`,
                    format: 'json',
                    addressdetails: 1,
                    limit: 1
                },
                headers: { 'User-Agent': 'Parvathi' }
            });

            if (!stateRes.data || stateRes.data.length === 0) {
                return { error: 'State not found' };
            }

            const stateOSMID = stateRes.data[0].osm_id;

            // Step 2: Use Overpass API to fetch all districts (admin_level=8) in that state
            const overpassQuery = `
[out:json][timeout:25];
rel(${stateOSMID})->.state;
rel[admin_level=8](area.state);
out center;
        `;

            const overpassRes = await axios.post('https://overpass-api.de/api/interpreter', overpassQuery, {
                headers: { 'Content-Type': 'text/plain' }
            });

            const elements = overpassRes.data.elements;
            if (!elements || elements.length === 0) {
                return { error: 'No districts found for this state' };
            }

            // Map the districts to name, lat, lon
            const districts = elements.map(d => ({
                name: d.tags.name,
                lat: d.center ? d.center.lat : null,
                lon: d.center ? d.center.lon : null
            }));

            return {
                state: stateName,
                districts: districts
            };

        } catch (error) {
            console.error(error);
            return { error: 'Error fetching data from API' };
        }
    });

});