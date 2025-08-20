"use client";
import JobCard from "@/components/JobCard.jsx";
import Navbar from "@/components/Navbar.jsx";
import SearchFilters from "@/components/SearchFilters.jsx";
import React, { useEffect, useState } from "react";
import api from "@/utils/api.js";
import withAuth from "@/hoc/withAuth";


const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg ${currentPage === page
            ? "bg-indigo-600 text-white"
            : "bg-gray-200 text-gray-700"
            }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

function App() {
  const [query, setQuery] = useState("");
  const [salaryRange, setSalaryRange] = useState({ min: 0, max: 100000000 });
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    //chgeck token or go to login
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }

  })

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await api.get("/job", {
          params: { page, limit },
        });
        const { items, pages } = response.data;
        setJobs(items);
        setFilteredJobs(items); // ✅ start with all jobs
        setTotalPages(pages);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [page, limit]);

  const applyFilters = (filters = {}) => {
    const {
      searchQuery = query,
      min = salaryRange.min,
      max = salaryRange.max,
      locationFilter = location,
      jobTypeFilter = jobType,
    } = filters;

    const lower = searchQuery.toLowerCase();

    const newFilteredJobs = jobs.filter((job) => {
      // 🔍 Search filter
      const matchesSearch =
        (job.title?.toLowerCase() || "").includes(lower) ||
        (job.description?.toLowerCase() || "").includes(lower);

      // 💰 Salary filter (parse LPA to monthly safely)
      let monthlySalary = 0;
      if (job.salary) {
        const lpa = parseInt(job.salary.replace("LPA", "").trim()) || 0;
        monthlySalary = (lpa * 100000) / 12;
      }
      const matchesSalary = monthlySalary >= min && monthlySalary <= max;

      // 📍 Location filter
      const matchesLocation =
        !locationFilter ||
        locationFilter === "Preferred Location" ||
        job.location?.toLowerCase().includes(locationFilter.toLowerCase());

      // 💼 Job type filter
      const matchesJobType =
        !jobTypeFilter ||
        jobTypeFilter === "Job type" ||
        job.jobType?.toLowerCase() === jobTypeFilter.toLowerCase();

      return (
        matchesSearch && matchesSalary && matchesLocation && matchesJobType
      );
    });


    setFilteredJobs(newFilteredJobs);
  };

  // Handlers
  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    applyFilters({ searchQuery });
  };

  const handleSalaryChange = (min, max) => {
    setSalaryRange({ min, max });
    applyFilters({ min, max });
  };

  const handleLocationChange = (locationFilter) => {
    setLocation(locationFilter);
    applyFilters({ locationFilter });
  };

  const handleJobTypeChange = (jobTypeFilter) => {
    setJobType(jobTypeFilter);
    applyFilters({ jobTypeFilter });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className=" max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        <SearchFilters
          onSearch={handleSearch}
          onSalaryChange={handleSalaryChange}
          onLocationChange={handleLocationChange}
          onJobTypeChange={handleJobTypeChange}
        />
        {loading ? (
          <p className="col-span-full text-center text-gray-600 mt-6">
            Loading jobs...
          </p>
        ) : (
          <div className="mt-6">
            <div className="justify-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job, index) => (
                  <JobCard key={index} {...job} />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-600">
                  No jobs found matching your filters 🚫
                </p>
              )}
            </div>
            {totalPages > 1 && (
              <Pagination
                totalPages={totalPages}
                currentPage={page}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
export default withAuth(App);