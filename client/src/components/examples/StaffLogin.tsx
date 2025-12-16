import StaffLogin from "../staff/StaffLogin";

export default function StaffLoginExample() {
  return <StaffLogin onLogin={(username) => console.log("Logged in as:", username)} />;
}
