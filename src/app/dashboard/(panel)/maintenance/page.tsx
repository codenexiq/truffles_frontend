import { MaintenanceScreen } from "@/components/dashboard/maintenance/MaintenanceScreen";

// Waits for the sign-in check before showing anything, so it is not an "instant" page (see ../../layout.tsx).
export const instant = false;

export default function MaintenancePage() {
  return <MaintenanceScreen />;
}
