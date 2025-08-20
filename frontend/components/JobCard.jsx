import React from "react";
import { Briefcase, MapPin, IndianRupee } from "lucide-react";

const api = process.env.NEXT_PUBLIC_API_BASE_URL;
const JobCard = ({
    companyLogo,
    title,
    experience,
    location,
    salary,
    posted,
    description,
    jobType,
    department,
    education,
    shift,
}) => {
    // Short description fallback
    const shortDesc = description
        ? description.split(". ").slice(0, 2)
        : ["No description available"];
    function timeAgo(date) {
        const now = new Date();
        const postedTime = new Date(date);
        const diff = Math.floor((now - postedTime) / 1000); // seconds

        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    }

    return (
        <article className="relative flex flex-col bg-white border border-gray-200 rounded-2xl shadow-sm p-6 w-[320px] h-full hover:shadow-md hover:-translate-y-1 transition">
            {/* 📌 Badge */}
            {posted && (
                <span className="absolute right-4 top-4 text-[11px] font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                    {timeAgo(posted)}
                </span>
            )}


            {/* 🏢 Logo */}
            <div className="h-14 w-14 rounded-xl bg-gray-100 flex items-center justify-center shadow-sm overflow-hidden">
                {companyLogo ? (
                    
                    <img
                        src={`${api}${companyLogo}`}
                        alt="Company Logo"
                    />


                ) : (
                    <span className="text-xs text-gray-400">N/A</span>
                )}
            </div>

            {/* 📌 Title */}
            <h3 className="mt-4 text-lg font-semibold text-gray-900 leading-snug">
                {title}
            </h3>

            {/* 📊 Meta row */}
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                {experience && (
                    <div className="flex items-center gap-1.5">
                        <Briefcase className="h-4 w-4 shrink-0 text-gray-500" />
                        <span>{experience}</span>
                    </div>
                )}
                {location && (
                    <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 shrink-0 text-gray-500" />
                        <span>{location}</span>
                    </div>
                )}
                {salary && (
                    <div className="flex items-center gap-1.5">
                        <IndianRupee className="h-4 w-4 shrink-0 text-gray-500" />
                        <span>{salary}</span>
                    </div>
                )}
            </div>

            {/* 📄 Extra details */}
            <p className="mt-2 text-xs text-gray-500 space-x-1">
                {jobType && <span>{jobType}</span>}
                {department && <span>• {department}</span>}
                {education && <span>• {education}</span>}
                {shift && <span>• {shift}</span>}
            </p>

            {/* 📋 Description */}
            <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-gray-600 flex-1">
                {shortDesc.map((line, i) => (
                    <li key={i}>{line.replace(/\.$/, "")}</li>
                ))}
            </ul>

            {/* CTA button */}
            <button
                type="button"
                className="mt-5 w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium py-2.5 hover:from-blue-600 hover:to-blue-700 shadow-sm transition"
            >
                Apply Now
            </button>
        </article>
    );
};

export default JobCard;
