const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.post('/estimate', (req, res) => {
  const { rooftopArea, dwellers, openSpace, location } = req.body;

  const rainfall = getRainfall(location);
  const runoffCoefficient = 0.8;
  const harvestingPotential = rooftopArea * rainfall * runoffCoefficient;

  const feasibility = getFeasibility(harvestingPotential);
  const structure = getStructure(harvestingPotential, openSpace);
  const runoffVolume = harvestingPotential * 0.9;
  const groundwaterInfo = getGroundwaterInfo(location);
  const costEstimate = getCost(structure.type);
  const costBenefit = getCostBenefit(harvestingPotential, dwellers);

  res.json({
    harvestingPotential: Math.round(harvestingPotential),
    feasibility,
    recommendedStructure: structure.type,
    structureSize: structure.size,
    runoffVolume: Math.round(runoffVolume),
    groundwaterInfo,
    costEstimate,
    costBenefit
  });
});

function getRainfall(location) {
  const data = {
    Delhi: 800,
    Mumbai: 2000,
    Chennai: 1200,
    Lucknow: 1000
  };
  return data[location] || 1000;
}

function getFeasibility(potential) {
  if (potential > 50000) return "Highly feasible";
  if (potential > 20000) return "Feasible with changes";
  return "Not feasible";
}

function getStructure(potential, openSpace) {
  if (openSpace > 50) return { type: "Recharge Pit", size: "2m × 2m × 2m" };
  if (openSpace > 20) return { type: "Recharge Trench", size: "5m × 1m × 1.5m" };
  return { type: "Recharge Shaft", size: "1m × 1m × 3m" };
}

function getGroundwaterInfo(location) {
  const data = {
    Delhi: { aquifer: "Alluvial", rechargeRate: "Moderate" },
    Mumbai: { aquifer: "Basaltic", rechargeRate: "High" },
    Chennai: { aquifer: "Coastal Sediment", rechargeRate: "Low" },
    Lucknow: { aquifer: "Gangetic Alluvium", rechargeRate: "Moderate" }
  };
  return data[location] || { aquifer: "Unknown", rechargeRate: "Unknown" };
}

function getCost(type) {
  const baseCosts = {
    "Recharge Pit": 15000,
    "Recharge Trench": 20000,
    "Recharge Shaft": 18000
  };
  return baseCosts[type] || 16000;
}

function getCostBenefit(potential, dwellers) {
  const waterSaved = potential * 0.75;
  const moneySaved = Math.round(waterSaved / 1000 * 25); // ₹25 per 1000L
  return {
    waterSaved: Math.round(waterSaved),
    moneySaved: `₹${moneySaved} per year`
  };
}

app.listen(3000, () => console.log('Server running on port 3000'));