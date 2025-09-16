const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Load rainfall and groundwater datasets
const rainfallData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'rainfallData.json'))
);

const groundwaterData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'groundwaterData.json'))
);

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

  const feasibility = getFeasibility(harvestingPotential, rooftopArea, soilType);
  const structure = getStructure(openSpace, hasBorewell);
  console.log("Structure type:", structure.type);
  console.log("Structure size:", structure.size);

  const runoffVolume = harvestingPotential * 0.9;
  const rechargeVolume = runoffVolume;
  const groundwaterInfo = getGroundwaterInfo(location);
  const costEstimate = getCost(structure.type, structure.size);
  const costBenefit = getCostBenefit(harvestingPotential);

  res.json({
    harvestingPotential: Math.round(harvestingPotential),
    feasibility: feasibility,
    recommendedStructure: structure.type,
    structureSize: structure.size,
    runoffVolume: Math.round(runoffVolume),
    rechargeVolume: Math.round(rechargeVolume),
    groundwaterInfo: groundwaterInfo,
    estimatedCost: costEstimate,
    costBenefit: costBenefit,
    downloadableReport: null
    

  });
});

// 🔍 Normalize location input
function normalizeLocation(input) {
  return input.trim().toLowerCase();
}

// 🔍 Rainfall lookup
function getRainfall(location) {
  const normalized = normalizeLocation(location);
  for (const state in rainfallData) {
    for (const district in rainfallData[state]) {
      if (district.toLowerCase() === normalized) {
        return rainfallData[state][district];
      }
    }
  }
  return 1000;
}

// 🔍 Groundwater lookup
function getGroundwaterInfo(location) {
  const normalized = normalizeLocation(location);
  for (const state in groundwaterData) {
    for (const district in groundwaterData[state]) {
      if (district.toLowerCase() === normalized) {
        return groundwaterData[state][district];
      }
    }
  }
  return {
    aquifer: "Unknown",
    rechargeRate: "Unknown",
    depth: "Unknown",
    status: "Unknown"
  };
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

function getFeasibility(potential, area, soilType) {
  if (soilType === "Clayey") return "Not feasible";
  if (area < 20) return "Limited feasibility";
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

function getCost(type, size) {
  if (!type || typeof type !== "string") return 0;
  const baseCosts = {
    "Recharge Pit": 15000,
    "Recharge Trench": 20000,
    "Recharge Shaft": 18000
  };
  const cleanType = type.replace(" (near borewell)", "").trim();
  return baseCosts[cleanType] || 16000;
}

function getCostBenefit(potential) {
  const waterSaved = potential * 0.75;
  const moneySaved = Math.round(waterSaved / 1000 * 25);
  const subsidy = Math.round(moneySaved * 0.2);
  return {
    waterSaved: Math.round(waterSaved),
    moneySaved: `₹${moneySaved} per year`,
    subsidyUsed: `₹${subsidy} approx`
  };
}

app.listen(3000, () => console.log('Server running on port 3000'));