const axios = require('axios');
const backendUrl = 'https://backend-image-latest-cn0k.onrender.com';

const callWildlifeTrendEndpoint = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/predict/wildlife_trend`, {
        features: [8.5, 12.1, 6.7, 4.4, 3.3],
      });
  
      console.log("Prediction Result:", response.data);
    } catch (error) {
      console.error("Error calling Wildlife Trend endpoint:", error);
    }
  };
  
  callWildlifeTrendEndpoint();
  