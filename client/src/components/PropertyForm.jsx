import { useState } from 'react';

export default function PropertyForm({ onSubmit }) {
  const [form, setForm] = useState({
    rooftopArea: '',
    dwellers: '',
    openSpace: '',
    location: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Rooftop Area (sq. meters)</label>
        <input
          name="rooftopArea"
          type="number"
          value={form.rooftopArea}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Number of Dwellers</label>
        <input
          name="dwellers"
          type="number"
          value={form.dwellers}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Available Open Space (sq. meters)</label>
        <input
          name="openSpace"
          type="number"
          value={form.openSpace}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Location</label>
        <select
          name="location"
          value={form.location}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Location</option>
          <option value="Delhi">Delhi</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Chennai">Chennai</option>
        </select>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Calculate Potential
      </button>
    </form>
  );
}