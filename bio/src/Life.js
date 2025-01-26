import React, { useState } from 'react';


const backendUrl = process.env.REACT_APP_BACKEND_URL;


const callWildlifeTrendEndpoint = (features) => {
  console.log("Opening test.js with features:", features);

  return fetch(`${backendUrl}/wildlife_trend`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ features: features })
  })
  .then(response => response.json())
  .then(data => {
    console.log("API Response Data:", data);
    
    if (data && data.interpretation) {
      const trend = data.interpretation; // 'increased' or other interpretations
      const impactScore = data.predicted_class; // Use predicted_class as impactScore (adjust based on your needs)
      
      return { trend, impactScore };
    } else {
      console.error("Unexpected response structure:", data);
      return { trend: 'Error', impactScore: 'Error' }; // Default response in case of error
    }
  })
  .catch(error => {
    console.error("Error calling Wildlife Trend endpoint:", error);
    return { trend: 'Error', impactScore: 'Error' };
  });
};

const WildlifeMonitorDashboard = () => {
  const [inputs, setInputs] = useState({
   
    deforestationRate: 0,
    urbanizationRate: 0,
    illegalPoachingCases: 0,
    annualPrecipitation: 0,
    temperatureAnomaly: 0,
  
  });

  const [output, setOutput] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value) || value
    }));
  };

  // Function to call the API and return the data
 

  const analyzeWildlifeChanges = async () => {
    const {
      deforestationRate,
      urbanizationRate,
      annualPrecipitation,
      temperatureAnomaly,
      illegalPoachingCases
    } = inputs;
  
    const features = [
      illegalPoachingCases,
      deforestationRate,
      temperatureAnomaly,
      annualPrecipitation,
      urbanizationRate
    ];
  
    console.log(features);
  
    // Call the API and get the prediction data
    const predictionData = await callWildlifeTrendEndpoint(features);
  
    // Ensure that the data returned from the API is valid
    if (predictionData && predictionData.trend) {
      setOutput({
        trend: predictionData.trend,
        impactScore: predictionData.impactScore || 'No data' // Handle missing impactScore
      });
    } else {
      console.error("Invalid or missing data in prediction response");
      setOutput({
        trend: 'Error',
        impactScore: 'Error'
      });
    }
  };
  
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      background: 'linear-gradient(135deg, #e0f8f7, #b2dfdb)',
      borderRadius: '15px',
      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
    },
    headerSection: {
      display: 'flex',
      marginBottom: '20px',
      background: 'rgba(255,255,255,0.7)',
      borderRadius: '10px',
      padding: '20px'
    },
    modelDescription: {
      flex: '2',
      paddingRight: '20px',
      marginRight: '100px',
      textAlign: 'left'
    },
    imageContainer: {
      flex: '1',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    modelImage: {
      maxWidth: '130%',
      maxHeight: '300px',
      borderRadius: '10px',
    },
    dashboardContainer: {
      background: 'rgba(255,255,255,0.7)',
      borderRadius: '10px',
      padding: '20px'
    },
    inputGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '15px'
    },
    inputField: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      marginBottom: '5px',
      color: '#2c3e50'
    },
    input: {
      padding: '10px',
      border: '1px solid #3498db',
      borderRadius: '5px'
    },
    button: {
      gridColumn: 'span 3',
      padding: '12px',
      backgroundColor: '#2ecc71',
      color: 'white',
      border: 'none',
      borderRadius: '7px',
      cursor: 'pointer'
    },
    resultSection: {
      marginTop: '20px', 
      textAlign: 'center'
    },
    resultCard: {
      background: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerSection}>
        <div style={styles.modelDescription}>
          <h2>Wildlife Impact Predictor Model</h2>
          <p>This advanced ecological monitoring model assesses wildlife population dynamics by analyzing critical environmental factors:</p>
          <ul>
            <li>Deforestation impacts</li>
            <li>Urbanization pressures</li>
            <li>Protected area effectiveness</li>
            <li>Conservation efforts</li>
            <li>Climate change indicators</li>
          </ul>
          <p>Our predictive algorithm calculates a comprehensive impact score, revealing potential trends in wildlife population changes.</p>
        </div>
        <div style={styles.imageContainer}>
          <img 
            src="ww.png" 
            alt="Wildlife Ecosystem Model" 
            style={styles.modelImage}
          />
        </div>
      </div>

      <div style={styles.dashboardContainer}>
        <div style={styles.inputGrid}>
          {Object.keys(inputs).map(key => (
            <div key={key} style={styles.inputField}>
              <label style={styles.label}>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
              <input
                type="number"
                name={key}
                value={inputs[key]}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>
          ))}
          <button 
            onClick={analyzeWildlifeChanges}
            style={styles.button}
          >
            Predict Wildlife Impact
          </button>
        </div>

        {output && (
          <div style={styles.resultSection}>
            <h2>Prediction Results</h2>
            <div style={styles.resultCard}>
              <p>Wildlife Population Trend: <strong>{output.trend}</strong></p>
              <p>Impact Intensity: <strong>{output.impactScore}</strong></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WildlifeMonitorDashboard;
