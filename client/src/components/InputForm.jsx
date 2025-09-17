import { useState } from 'react';

function PropertyForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    location: '',
    rooftopArea: '',
    openSpace: '',
    dwellers: '',
    roofType: '',
    hasBorewell: 'No',
    soilType: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Location */}
      <div>
        <label className="block font-medium mb-1">Location (City or Pin Code)</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      {/* Roof Area */}
      <div>
        <label className="block font-medium mb-1">Roof Area (m²)</label>
        <input
          type="number"
          name="rooftopArea"
          value={formData.rooftopArea}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      {/* Open Space */}
      <div>
        <label className="block font-medium mb-1">Open Space Available (m²)</label>
        <input
          type="number"
          name="openSpace"
          value={formData.openSpace}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      {/* Number of Dwellers */}
      <div>
        <label className="block font-medium mb-1">Number of Dwellers</label>
        <input
          type="number"
          name="dwellers"
          value={formData.dwellers}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      {/* Roof Type */}
      <div>
        <label className="block font-medium mb-1">Roof Type</label>
        <select
          name="roofType"
          value={formData.roofType}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">Select</option>
          <option value="Flat Concrete">Flat Concrete</option>
          <option value="Sloped Concrete">Sloped Concrete</option>
          <option value="Flat Tin">Flat Tin</option>
          <option value="Sloped Tin">Sloped Tin</option>
        </select>
      </div>

      {/* Existing Borewell */}
      <div>
        <label className="block font-medium mb-1">Existing Borewell or Tube Well</label>
        <select
          name="hasBorewell"
          value={formData.hasBorewell}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      {/* Soil Type */}
      <div>
        <label className="block font-medium mb-1">Soil Type</label>
        <select
          name="soilType"
          value={formData.soilType}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">Select</option>
          <option value="Sandy">Sandy</option>
          <option value="Clayey">Clayey</option>
          <option value="Loamy">Loamy</option>
          <option value="Mixed">Mixed</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Calculate Potential
      </button>
    </form>
  );
}

export default PropertyForm;