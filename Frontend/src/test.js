const axios = require('axios');
const backendUrl = 'https://backend-image-latest-cn0k.onrender.com';

const callWildlifeTrendEndpoint = async (Features) => {
    console.log("opening test.js",Features);
    try {

      const response = await axios.post(`${backendUrl}/api/predict/aquatic`, {
        features: [10,2,3,3,4]
        
      });
      console.log(Features);
      console.log("Prediction Result:", response.data);
    } catch (error) {
      console.error("Error calling Wildlife Trend endpoint:", error);
    }
  };
  
  callWildlifeTrendEndpoint()