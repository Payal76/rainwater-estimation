import { useState } from 'react';
import PropertyForm from './components/PropertyForm';
import './index.css'; // Make sure this is imported for custom CSS

function App() {
  const [results, setResults] = useState(null);

  const handleFormSubmit = async (formData) => {
    try {
      const response = await fetch('http://localhost:3000/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      setResults(result);
    } catch (error) {
      console.error("Error fetching estimation:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-10">Estimate Your Rooftop Potential</h1>

      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="custom-layout">
          {/* Left: Property Details */}
          <div className="section">
            <h2 className="text-xl font-semibold mb-4">Property Details</h2>
            <PropertyForm onSubmit={handleFormSubmit} />
          </div>

          {/* Right: Estimation Results */}
          <div className="section">
            <h2 className="text-xl font-semibold mb-4">Estimation Results</h2>
            {results ? (
              <div className="space-y-4 text-gray-800">
                <p><strong>Rainwater Potential:</strong> {results.harvestingPotential} L/year</p>
                <p><strong>Feasibility:</strong> {results.feasibility}</p>
                <p><strong>Recommended Structure:</strong> {results.recommendedStructure}</p>
                <p><strong>Structure Size:</strong> {results.structureSize}</p>
                <p><strong>Runoff Volume:</strong> {results.runoffVolume} L/year</p>
                <p><strong>Groundwater Info:</strong> {results.groundwaterInfo.aquifer} aquifer, Recharge Rate: {results.groundwaterInfo.rechargeRate}</p>
                <p><strong>Estimated Cost:</strong> ₹{results.costEstimate}</p>
                <p><strong>Cost-Benefit:</strong> Saves {results.costBenefit.waterSaved} L/year, {results.costBenefit.moneySaved}</p>
              </div>
            ) : (
              <p className="text-gray-500">Fill in your property details and click "Calculate Potential" to see your rainwater harvesting estimation.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;