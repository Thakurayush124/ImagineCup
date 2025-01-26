import React, { useState } from 'react';

const newsItems = [
  {
    image: "fs1.png",
    title: "Enter Data:",
    description: " Input values for the five key features.",
    link: "#",
    linkText: "LEARN MORE"
  },
  {
    image: "fs2.png",
    title: "Predict:",
    description: " Click  Predict to receive results Increase in Forest Reduction Decrease in Forest Reduction",
    link: "#",
    linkText: "READ MORE"
  },
  {
    image: "fs3.png",
    title: "Analyze:",
    description: "View a breakdown of how each feature influenced the result.",
    link: "#",
    linkText: "READ MORE"
  }
];


const ForestReductionCalculator = () => {
  const [inputs, setInputs] = useState({
    humanCivilizationRate: 0,
    carbonEmissionRate: 0,
    factoriesSetupRate: 0,
    dependencyOnForestProducts: 0,
    tribalPopulation: 0
  });

  const [output, setOutput] = useState(null);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Function to send data to the backend and get the response
  const callforest_insights = async (features) => {
    console.log("Sending features to API:", features);
  
    try {
      const response = await fetch(`${backendUrl}/forest_insights`, {
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
        const trend = data.predicted_forest_area_reduction > 0
          ? 'Deforestation Increasing'
          : 'Deforestation Decreasing'; // Example logic to interpret the reduction
        const impactScore = data.predicted_forest_area_reduction.toFixed(2); // Display the predicted reduction rounded to two decimal places
  
        return { trend, impactScore };
      } else {
        console.error("Unexpected response structure:", data);
        return { trend: 'Error', impactScore: 'Error' };
      }
    } catch (error) {
      console.error("Error calling Forest Insights endpoint:", error);
      return { trend: 'Error', impactScore: 'Error' };
    }
  };
  

  // Analyze inputs and send them to the API
  const analyzeWildlifeChanges = async () => {
    const { 
      humanCivilizationRate, 
      carbonEmissionRate, 
      factoriesSetupRate, 
      dependencyOnForestProducts, 
      tribalPopulation 
    } = inputs;

    const features = [
      humanCivilizationRate,
      carbonEmissionRate,
      factoriesSetupRate,
      dependencyOnForestProducts,
      tribalPopulation
    ];

    // Call the API and get the prediction data
    const predictionData = await callforest_insights(features);

    // Set the output data
    setOutput({
      trend: predictionData.trend,
      impactScore: predictionData.impactScore
    });
  };

  const styles = {
    container: {
      maxWidth: '700px',
      margin: '5% auto',
      padding: '20px',
      background: 'linear-gradient(135deg, #e6f3e6, #c2e0c2)',
      borderRadius: '15px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    inputGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '15px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      marginBottom: '5px',
      color: '#3a7a3a'
    },
    input: {
      padding: '10px',
      border: '1px solid #8bc38b',
      borderRadius: '5px',
      backgroundColor: '#f0f9f0'
    },
    button: {
      width: '100%',
      padding: '12px',
      marginTop: '20px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease'
    },
    resultContainer: {
      marginTop: '20px',
      textAlign: 'center'
    },
    resultCard: {
      background: '#fff',
      padding: '15px',
      borderRadius: '10px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      marginTop: '20px'
    },
    resultText: {
      fontSize: '18px',
      fontWeight: 'bold'
    }
  };

  return (

     <>
    <div className="news-container">
        <h2>How to use</h2>
        <div className="news-grid">
          {newsItems.map((item, index) => (
            <div key={index} className="news-item">
              <img src={item.image} alt={item.title} className="news-image" />
              <div className="news-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <a href={item.link} className="news-link">
                  {item.linkText}
                  <span className="plus-icon">+</span>
                </a>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    <div style={styles.container}>
      <h1>Deforestation Prediction</h1>

      <div style={styles.inputGrid}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Human Civilization Rate</label>
          <input 
            type="number" 
            name="humanCivilizationRate"
            value={inputs.humanCivilizationRate}
            onChange={handleInputChange}
            min="0" 
            max="100"
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Carbon Emission Rate</label>
          <input 
            type="number" 
            name="carbonEmissionRate"
            value={inputs.carbonEmissionRate}
            onChange={handleInputChange}
            min="0" 
            max="100"
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Factories Setup Rate</label>
          <input 
            type="number" 
            name="factoriesSetupRate"
            value={inputs.factoriesSetupRate}
            onChange={handleInputChange}
            min="0" 
            max="100"
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Dependency on Forest Products</label>
          <input 
            type="number" 
            name="dependencyOnForestProducts"
            value={inputs.dependencyOnForestProducts}
            onChange={handleInputChange}
            min="0" 
            max="100"
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Tribal Population</label>
          <input 
            type="number" 
            name="tribalPopulation"
            value={inputs.tribalPopulation}
            onChange={handleInputChange}
            min="0" 
            max="100"
            style={styles.input}
          />
        </div>
      </div>

      <button 
        onClick={analyzeWildlifeChanges} 
        style={styles.button}
      >
        Predict Wildlife Impact
      </button>

      {output && (
        <div style={styles.resultContainer}>
          <div style={styles.resultCard}>
            <p style={styles.resultText}>Wildlife Population Trend: {output.trend}</p>
            <p style={styles.resultText}>Impact Intensity: {output.impactScore}</p>
          </div>
        </div>
      )}
    </div>
    <style>{
      
      `
        .news-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 3rem 2rem;
        }

        .news-container h2 {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 2rem;
          color: #333;
        }

        .news-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .news-item {
          background: #f8f8f8;
          border-radius: 4px;
          overflow: hidden;
          transition: transform 0.3s;
        }

        .news-item:hover {
          transform: translateY(-5px);
        }

        .news-image {
          width: 80%;
          height: 200px;
          
        }

        .news-content {
          padding: 1.5rem;
        }

        .news-content h3 {
          font-size: 1.25rem;
          margin-bottom: 1rem;
          color: #333;
        }

        .news-content p {
          color: #666;
          margin-bottom: 1rem;
          line-height: 1.6;
          text-align: center;
        }

        .news-link {
          display: inline-flex;
          align-items: center;
          color: #e53e3e;
          text-decoration: none;
          font-weight: bold;
          gap: 0.5rem;
          transition: color 0.3s;
        }

        .news-link:hover {
          color: #c53030;
        }

        .plus-icon {
          font-size: 1.2rem;
        }`}
      </style>
    </>
  );
};

export default ForestReductionCalculator;
