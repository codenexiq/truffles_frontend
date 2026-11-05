import { ReservationsScreen } from "@/components/dashboard/reservations/ReservationsScreen";

// Waits for the sign-in check before showing anything, so it is not an "instant" page (see ../../layout.tsx).
export const instant = false;

export default function ReservationsPage() {
  return <ReservationsScreen />;
}
