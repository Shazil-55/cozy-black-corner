
import React from "react";
import { useLocation } from "react-router-dom";
import CourseReports from "@/components/reports/CourseReports";
import UserReports from "@/components/reports/UserReports";
import GroupReports from "@/components/reports/GroupReports";
import CategoryReports from "@/components/reports/CategoryReports";
import StudentReports from "@/components/reports/StudentReports";
import AssignmentReports from "@/components/reports/AssignmentReports";
import { useRole } from "@/context/RoleContext";

const Reports: React.FC = () => {
  const location = useLocation();
  const { role } = useRole();

  // Determine which report to show based on the route
  const getReportComponent = () => {
    const path = location.pathname;
    
    if (path.includes('/reports/courses')) {
      return <CourseReports />;
    } else if (path.includes('/reports/users')) {
      return <UserReports />;
    } else if (path.includes('/reports/groups')) {
      return <GroupReports />;
    } else if (path.includes('/reports/categories')) {
      return <CategoryReports />;
    } else if (path.includes('/reports/students')) {
      return <StudentReports />;
    } else if (path.includes('/reports/assignments')) {
      return <AssignmentReports />;
    } else {
      // Default report based on role
      if (role === 'administrator') {
        return <CourseReports />;
      } else if (role === 'instructor') {
        return <CourseReports />;
      } else {
        return <CourseReports />;
      }
    }
  };

  return (
    <div className="space-y-6">
      {getReportComponent()}
    </div>
  );
};

export default Reports;
