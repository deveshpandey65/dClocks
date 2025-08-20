import React, { useState } from "react";
import { Search, MapPin, Briefcase } from "lucide-react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const SearchFilters = ({
  onSearch,
  onSalaryChange,
  onLocationChange,
  onJobTypeChange,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [salaryRange, setSalaryRange] = useState([50000, 80000]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  return (
    <section className="max-w-7xl mx-auto mt-6 px-4">
      <div className="flex flex-wrap gap-4 bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4">
        {/* 🔍 Search */}
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <Search className="h-4 w-4 text-gray-500 shrink-0" />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearch}
            placeholder="Search By Job Title, Role"
            className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
          />
        </div>

        {/* 📍 Location */}
        <div className="flex items-center gap-2 flex-1 min-w-[180px]">
          <MapPin className="h-4 w-4 text-gray-500 shrink-0" />
          <select
            className="w-full bg-transparent text-sm text-gray-700 focus:outline-none"
            onChange={(e) => onLocationChange(e.target.value)}
          >
            <option>Preferred Location</option>
            <option>Bengaluru</option>
            <option>Mumbai</option>
            <option>Delhi</option>
            <option>Remote</option>
          </select>
        </div>

        {/* 💼 Job type */}
        <div className="flex items-center gap-2 flex-1 min-w-[180px]">
          <Briefcase className="h-4 w-4 text-gray-500 shrink-0" />
          <select
            className="w-full bg-transparent text-sm text-gray-700 focus:outline-none"
            onChange={(e) => onJobTypeChange(e.target.value)}
          >
            <option>Job type</option>
            <option>Full-time</option>
            <option>Internship</option>
            <option>Contract</option>
          </select>
        </div>

        {/* 💰 Salary slider */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1 min-w-[240px]">
          <span className="text-sm text-gray-600 whitespace-nowrap">
            Salary / Month
          </span>
          <div className="w-full sm:w-40">
            <Slider
              range
              min={20000}
              max={200000}
              step={5000}
              value={salaryRange}
              onChange={(value) => {
                if (Array.isArray(value)) {
                  setSalaryRange([value[0], value[1]]);
                  onSalaryChange(value[0], value[1]); // ✅ send min & max separately
                }
              }}
              trackStyle={[
                { backgroundColor: "black", height: 4, borderRadius: 9999 },
              ]}
              handleStyle={[
                {
                  borderColor: "black",
                  height: 18,
                  width: 18,
                  marginTop: -7,
                  backgroundColor: "black",
                  borderRadius: "50%",
                },
                {
                  borderColor: "black",
                  height: 18,
                  width: 18,
                  marginTop: -7,
                  backgroundColor: "black",
                  borderRadius: "50%",
                },
              ]}
              railStyle={{
                backgroundColor: "#e5e7eb",
                height: 4,
                borderRadius: 9999,
              }}
            />
          </div>
          <span className="text-sm text-gray-600 whitespace-nowrap">
            ₹{salaryRange[0] / 1000}k - ₹{salaryRange[1] / 1000}k
          </span>
        </div>
      </div>
    </section>
  );
};

export default SearchFilters;
