const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.post('/estimate', (req, res) => {
  const {
    location,
    rooftopArea,
    openSpace,
    dwellers,
    roofType,
    hasBorewell,
    soilType
  } = req.body;

  const rainfall = getRainfall(location);
  const runoffCoefficient = getRunoffCoefficient(roofType);
  const harvestingPotential = rooftopArea * rainfall * runoffCoefficient;

  const feasibility = getFeasibility(harvestingPotential, soilType);
  const structure = getStructure(openSpace, hasBorewell);
  const runoffVolume = harvestingPotential * 0.9;
  const rechargeVolume = runoffVolume; // Assuming full recharge
  const groundwaterInfo = getGroundwaterInfo(location);
  const costEstimate = getCost(structure.type);
  const costBenefit = getCostBenefit(harvestingPotential);

  res.json({
    harvestingPotential: Math.round(harvestingPotential),
    feasibility,
    recommendedStructure: structure.type,
    structureSize: structure.size,
    runoffVolume: Math.round(runoffVolume),
    rechargeVolume: Math.round(rechargeVolume),
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
    Lucknow: 1000,
    Khatauli: 950
  };
  return data[location] || 1000;
}

function getRunoffCoefficient(roofType) {
  const map = {
    "Flat Concrete": 0.85,
    "Sloped Concrete": 0.8,
    "Flat Tin": 0.75,
    "Sloped Tin": 0.7
  };
  return map[roofType] || 0.8;
}

function getFeasibility(potential, soilType) {
  if (soilType === "Clayey") return "Not feasible";
  if (potential > 50000) return "Highly feasible";
  if (potential > 20000) return "Feasible with changes";
  return "Not feasible";
}

function getStructure(openSpace, hasBorewell) {
  let type = "Recharge Shaft";
  let size = "1m × 1m × 3m";

  if (openSpace > 50) {
    type = "Recharge Pit";
    size = "2m × 2m × 2m";
  } else if (openSpace > 20) {
    type = "Recharge Trench";
    size = "5m × 1m × 1.5m";
  }

  if (hasBorewell === "Yes") {
    type += " (near borewell)";
  }

  return { type, size };
}

function getGroundwaterInfo(location) {
  const data = {
    Delhi: { aquifer: "Alluvial", rechargeRate: "Moderate" },
    Mumbai: { aquifer: "Basaltic", rechargeRate: "High" },
    Chennai: { aquifer: "Coastal Sediment", rechargeRate: "Low" },
    Lucknow: { aquifer: "Gangetic Alluvium", rechargeRate: "Moderate" },
    Khatauli: { aquifer: "Doab Alluvium", rechargeRate: "Moderate" }
  };
  return data[location] || { aquifer: "Unknown", rechargeRate: "Unknown" };
}

function getCost(type) {
  const baseCosts = {
    "Recharge Pit": 15000,
    "Recharge Trench": 20000,
    "Recharge Shaft": 18000
  };
  const cleanType = type.replace(" (near borewell)", "");
  return baseCosts[cleanType] || 16000;
}

function getCostBenefit(potential) {
  const waterSaved = potential * 0.75;
  const moneySaved = Math.round(waterSaved / 1000 * 25);
  return {
    waterSaved: Math.round(waterSaved),
    moneySaved: `₹${moneySaved} per year`
  };
}

app.listen(3000, () => console.log('Server running on port 3000'));