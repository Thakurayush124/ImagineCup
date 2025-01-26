import React, { useState } from 'react';

const AquaticMonitoring = () => {
  // Inline styles to replace external CSS
  const styles = {
    container: {
      maxWidth: '900px',
      margin: '3% auto',
      padding: '20px',
      backgroundColor: '#e6f7ff',
      borderRadius: '15px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
  
    introSection: {
      textAlign: 'center',
      marginBottom: '30px',
    },
    instructions: {
      backgroundColor: '#f4f9ff',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      marginTop: '30px',
    },
    instructionsContent: {
      display: 'flex',  // Use flexbox to arrange text and image side by side
      justifyContent: 'space-between',  // Space between the text and image
      alignItems: 'center',  // Align items vertically in the center
    },
    textSection: {
      flex: 1,  // This allows the text to take up the remaining space
      textAlign: 'left',
      marginRight: '160px',
     
    },
    imageSection: {
      flex: 1,  // This allows the image to take up the remaining space
      textAlign: 'center',
    },
    instructionsTitle: {
      fontSize: '1.4rem',
      fontWeight: 'bold',
      color: '#4a90e2',
      marginBottom: '20px',
    },
    instructionsList: {
      listStyleType: 'none',
      textAlign: 'left',
    },
    instructionItem: {
      fontSize: '1rem',
      color: 'black',
      marginBottom: '10px',
    },
    image: {
      maxWidth: '100%',  // Make sure the image doesn't overflow
      height: 'auto',  // Maintain aspect ratio of the image
      borderRadius: '10px',  // Optional: if you want to round the image corners
    },
    infCards: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '20px',
    },
    infoCard: {
      flex: 1,
      margin: '0 10px',
      padding: '20px',
      backgroundColor: '#f0f8ff',
      borderRadius: '10px',
      textAlign: 'center',
      transition: 'transform 0.3s ease',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    infoCardHover: {
      transform: 'scale(1.05)',
    },
    infoCardSvg: {
      width: '80px',
      height: '80px',
      marginBottom: '15px',
      color: '#4a90e2',
    },
    form: {
      backgroundColor: '#f4f9ff',
      padding: '30px',
      borderRadius: '15px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '15px',
    },
    input: {
      width: '90%',
      padding: '12px',
      border: '1px solid #b0d4ff',
      borderRadius: '8px',
      backgroundColor: '#fff',
      transition: '0.3s ease',
    },
    inputFocus: {
      outline: 'none',
      borderColor: '#4a90e2',
    },
    submitBtn: {
      width: '100%',
      padding: '15px',
      backgroundColor: '#4a90e2',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      marginTop: '20px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    submitBtnHover: {
      backgroundColor: '#357abd',
    },
    resultSection: {
      marginTop: '30px',
      textAlign: 'center',
    },
    resultCards: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    resultCard: {
      flex: 1,
      margin: '0 10px',
      padding: '20px',
      backgroundColor: '#e6f2ff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    cardTitle: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#4a90e2',
    },
    cardText: {
      fontSize: '1.1rem',
      color: '#333',
    },
    instructionsTitle: {
      fontSize: '1.4rem',
      fontWeight: 'bold',
      color: '#4a90e2',
      marginBottom: '20px',
    },
    instructionsList: {
      listStyleType: 'decimal',
      textAlign: 'left',
     
    },
    instructionItem: {
      fontSize: '1rem',
      color: 'black',
      marginBottom: '10px',

      

    },
  };

  const [formData, setFormData] = useState({
    turbidity: '',
    pH_Level: '',
    salinity: '',
    waterTemperature: '',
    dissolvedOxygen: ''
  });

  const [results, setResults] = useState(null);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  

  // Function to send data to the backend and get the response
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  console.log('Backend URL:', backendUrl);

  // Function to send data to the backend and get the response
  const callAquaticInsights = async (features) => {
    console.log("Sending features to API:", features);
  
    try {
      const response = await fetch(`${backendUrl}/aquatic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ features: features }),
      });
  
      const data = await response.json();
  
      if (data) {
        console.log("Prediction Result:", data);
  
        // Now, adjust this logic based on the new response structure
        const trend = data.interpretation; // "increased" or other interpretation
        const healthStatus = data.predicted_class === 1 ? 'Good' : 'Poor'; // Example logic
  
        return { trend, healthStatus };
      } else {
        console.error("Unexpected response structure:", data);
        return { trend: 'Error', healthStatus: 'Error' };
      }
    } catch (error) {
      console.error("Error calling Aquatic Insights endpoint:", error);
      return { trend: 'Error', healthStatus: 'Error' };
    }
  };
  
  
  // Analyze inputs and send them to the API
  const analyzeAquaticChanges = async () => {
    const { turbidity, pH_Level, salinity, waterTemperature, dissolvedOxygen } = formData;

    const features = [
      turbidity,
      pH_Level,
      salinity,
      waterTemperature,
      dissolvedOxygen
    ];

    // Call the API and get the prediction data
    const predictionData = await callAquaticInsights(features);

    // Set the output data
    setResults({
      trend: predictionData.trend,
      healthStatus: predictionData.healthStatus
    });
  };

  return (
    <div style={styles.container}>
    <div style={styles.introSection}>
      <h1 >🌊 Aquatic Monitoring System</h1>
      <div style={styles.instructions}>
        <h2 style={styles.instructionsTitle}>How to Use the Aquatic Monitoring System</h2>
        <div style={styles.instructionsContent}>
          <div style={styles.textSection}>
            <ol style={styles.instructionsList}>
              <li style={styles.instructionItem}>
                Input the water quality data :
                Enter turbidity (NTU), pH level, salinity (ppt), water temperature (°C), and dissolved oxygen (mg/L).
                
              </li>
              <li style={styles.instructionItem}>
                Select the water type :
                Choose between "Marine", "Freshwater", or "Brackish".
                
              </li>
              <li style={styles.instructionItem}>
               Submit the data :
               Click "Generate Ecosystem Report" to submit your data for analysis.
                
              </li>
              <li style={styles.instructionItem}>
                Review the results :
                View the Water Quality Trend and the Health Status of the ecosystem based on the data you provided.
                
              </li>
            </ol>
          </div>
          <div style={styles.imageSection}>
            <img
              src="aq.png" // Replace this with the actual path to your image
              alt="Aquatic Monitoring"
              style={styles.image}
            />
          </div>
        </div>
      </div>
    </div>

  

      <form onSubmit={(e) => {e.preventDefault(); analyzeAquaticChanges();}} style={styles.form}>
        <h2>Survey Input</h2>
        <div style={styles.formGrid}>
          <input
            type="number"
            name="turbidity"
            placeholder="Turbidity (NTU)"
            value={formData.turbidity}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
          <input
            type="number"
            name="pH_Level"
            placeholder="pH Level"
            value={formData.pH_Level}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
          <input
            type="number"
            name="salinity"
            placeholder="Salinity (ppt)"
            value={formData.salinity}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
          <input
            type="number"
            name="waterTemperature"
            placeholder="Water Temperature (°C)"
            value={formData.waterTemperature}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
          <input
            type="number"
            name="dissolvedOxygen"
            placeholder="Dissolved Oxygen (mg/L)"
            value={formData.dissolvedOxygen}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.submitBtn}>
          Generate Ecosystem Report
        </button>
      </form>

      {results && (
        <div style={styles.resultSection}>
          <h2>Ecosystem Health Results</h2>
          <div style={styles.resultCards}>
            <div style={styles.resultCard}>
              <h3 style={styles.cardTitle}>Aquatic life Trend</h3>
              <p style={styles.cardText}>{results.trend}</p>
            </div>
            <div style={styles.resultCard}>
              <h3 style={styles.cardTitle}>Health Status</h3>
              <p style={styles.cardText}>{results.healthStatus}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AquaticMonitoring;
