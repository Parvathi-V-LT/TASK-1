const cds = require('@sap/cds');
const axios = require('axios');

module.exports = cds.service.impl(function () {

  const { emp } = this.entities;

  this.after('CREATE', emp, async (data, req) => {

    try {
      // Call Translation Hub sandbox
      const response = await axios.post('https://sandbox.api.sap.com/sth',
        {
          sourceLanguage: "en",
          targetLanguage: "de",
          texts: [data.name, data.dept]
        },
        {
          headers: {
            "APIKey": "L2CBVtCJAgk8wAQc0AImyI7aBQoSJ7K3",
            "Content-Type": "application/json"
          }
        }
      );

      const translations = response.data.translations;

      // Insert translated text into localized table
      await cds.run(
        INSERT.into('translate.db.emp_texts').entries([
          {
            ID: data.ID,
            locale: 'de',
            name: translations[0].target,
            dept: translations[1].target
          }
        ])
      );

    } catch (error) {
      console.error("Translation Error:", error.response?.data || error.message);
    }

  });

});