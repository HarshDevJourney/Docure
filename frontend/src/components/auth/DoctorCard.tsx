import React from "react";

type Doctor = {
  name: string;
  title?: string;
  avatar?: string;
  specialty?: string[];
  rating?: number;
  hospital?: string;
  experience?: string;
  location?: string;
  bio?: string;
};

const DEFAULT_DOCTOR: Doctor = {
  name: "Dr. Aarti Sharma",
  title: "MD - General Physician",
  avatar:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80&auto=format&fit=crop",
  specialty: ["General Medicine", "Diabetology", "Preventive Care"],
  rating: 4.8,
  hospital: "City Health Clinic",
  experience: "12 yrs",
  location: "Mumbai, India",
  bio: "Compassionate physician focusing on preventive care and evidence based treatments. Available for in-clinic and teleconsultations.",
};

export default function DoctorCard({
  doctor = DEFAULT_DOCTOR,
}: {
  doctor?: Doctor;
}) {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="md:flex">
        {/* Left column - avatar and quick actions */}
        <div className="md:w-1/3 bg-blue-50 p-6 flex flex-col items-center justify-center gap-4">
          <img
            src={doctor.avatar}
            alt={doctor.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
          />

          <div className="text-center">
            <h3 className="text-xl font-semibold text-blue-600">
              {doctor.name}
            </h3>
            <p className="text-sm text-gray-600">{doctor.title}</p>
          </div>

          <div className="flex gap-2 mt-3">
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium shadow-sm hover:bg-blue-700 transition">
              Book n Appointment
            </button>
            <button className="px-4 py-2 rounded-lg bg-white border border-blue-200 text-blue-600 text-sm font-medium hover:bg-blue-50 transition">
              Teleconsult
            </button>
          </div>
        </div>

        {/* Right column - details */}
        <div className="md:w-2/3 p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2v4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 7a5 5 0 0 0 10 0"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 11v6a5 5 0 0 1-10 0v-6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {doctor.specialty?.[0] || "General"}
                </span>

                <div className="text-sm text-gray-500">{doctor.hospital}</div>
              </div>

              <p className="mt-4 text-gray-700 text-sm leading-relaxed">
                {doctor.bio}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {(doctor.specialty || []).map((s) => (
                  <span
                    key={s}
                    className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="ml-4 text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border shadow-sm">
                <svg
                  className="w-5 h-5 text-yellow-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                    stroke="none"
                    fill="currentColor"
                  />
                </svg>
                <div className="text-sm font-semibold">
                  {doctor.rating ?? 0}
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-600">
                <div>
                  <span className="font-medium text-gray-800">
                    Experience:{" "}
                  </span>
                  {doctor.experience}
                </div>
                <div className="mt-2">
                  <span className="font-medium text-gray-800">Location: </span>
                  {doctor.location}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t pt-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <a href="#" className="text-sm text-blue-600 underline">
                View profile
              </a>
              <a href="#" className="text-sm text-gray-500">
                Clinic details
              </a>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition">
                Message
              </button>
              <button className="px-4 py-2 rounded-lg bg-white border border-blue-200 text-blue-600 text-sm font-medium hover:bg-blue-50 transition">
                Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
Usage:
import DoctorCard from './DoctorCard';

<DoctorCard />

Or pass a doctor object:
<DoctorCard doctor={{ name: 'Dr. Ravi', title: 'MD', ... }} />
*/
