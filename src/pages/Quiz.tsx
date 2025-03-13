
import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Quiz: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Link
            to={`/class/${classId}`}
            className="inline-flex items-center text-talentlms-blue mb-4 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Class
          </Link>

          <div className="bg-white rounded-lg p-6 shadow-subtle">
            <h1 className="text-2xl font-medium text-talentlms-darkBlue mb-4">
              Class Quiz
            </h1>
            <p className="text-gray-600">
              This page will be populated with quiz questions based on the class content.
              The quiz interface will allow students to test their knowledge of the material.
            </p>
            <p className="mt-4 text-gray-600">
              Class ID: {classId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
