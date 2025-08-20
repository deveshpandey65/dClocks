import api from "@/utils/api";
import React, { useState } from "react";

// ✅ Modal Component
const Modal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "Full-time",
    salaryRange: "",
    deadline: "",
    description: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      formData.status = "PUBLISHED";
      formData.salary = formData.salaryRange || "Not specified";
      formData.deadline = formData.deadline || "No deadline specified";
      formData.description = formData.description || "No description provided";
      formData.posted = new Date().toISOString();
      formData.companyLogo = JSON.parse(localStorage.getItem("user"))?.companyLogo || null;
      formData.experience = formData.experience || "Not specified";
      formData.department = formData.department || "General";
      formData.education = formData.education || "Not specified";
      formData.shift = formData.shift || "Not specified";

      const token = localStorage.getItem("token");
      await api.post("/job", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onClose();
    } catch (error) {
      console.error("❌ Error creating job:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6 relative">
        {/* Close */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Create Job Opening</h2>

        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleCreateJob}>
          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>

          {/* Job Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Type</label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="Full-time">Full Time</option>
              <option value="Part-time">Part Time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Salary Range</label>
            <input
              type="text"
              name="salaryRange"
              value={formData.salaryRange}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Deadline</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* Description */}
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Job Description</label>
            <textarea
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* Buttons */}
          <div className="col-span-1 sm:col-span-2 flex justify-between mt-4">
            <button
              type="button"
              className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
              onClick={onClose}
            >
              Save Draft
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Publish »
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ✅ Responsive Navbar
const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const userRole = JSON.parse(localStorage.getItem("user"))?.role || "user";


  return (
    <header className="relative w-full bg-white">
      <nav className="flex items-center mt-4 rounded-[214px] border border-white shadow-xl shadow-[#7F7F7F26] justify-between max-w-5xl mx-auto h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-lg font-bold">
          M
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 font-mono font-semibold text-[16px] text-[#303030]">
          <li className="hover:text-gray-900 cursor-pointer">Home</li>
          <li className="hover:text-gray-900 cursor-pointer">Find Jobs</li>
          <li className="hover:text-gray-900 cursor-pointer">Find Talents</li>
          <li className="hover:text-gray-900 cursor-pointer">About us</li>
          <li className="hover:text-gray-900 cursor-pointer">Testimonials</li>
        </ul>

        {/* Create Job Button (only admin) */}
        {userRole === "admin" && (
          <button
            className="hidden md:block w-[123px] h-[38px] rounded-[30px] bg-gradient-to-r from-[#A128FF] to-[#6100AD] text-white text-sm font-medium transition-transform transform hover:scale-105"
            onClick={() => setIsModalOpen(true)}
          >
            Create Jobs
          </button>
        )}

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg border text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-md px-4 py-3 space-y-2">
          <p className="cursor-pointer hover:text-gray-900">Home</p>
          <p className="cursor-pointer hover:text-gray-900">Find Jobs</p>
          <p className="cursor-pointer hover:text-gray-900">Find Talents</p>
          <p className="cursor-pointer hover:text-gray-900">About us</p>
          <p className="cursor-pointer hover:text-gray-900">Testimonials</p>

          {userRole === "admin" && (
            <button
              className="mt-3 w-full rounded-[30px] bg-gradient-to-r from-[#A128FF] to-[#6100AD] text-white text-sm font-medium py-2"
              onClick={() => setIsModalOpen(true)}
            >
              Create Jobs
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
};

export default Navbar;
