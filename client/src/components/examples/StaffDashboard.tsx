import StaffDashboard from "../staff/StaffDashboard";

export default function StaffDashboardExample() {
  return <StaffDashboard username="Admin" onLogout={() => console.log("Logout clicked")} />;
}
