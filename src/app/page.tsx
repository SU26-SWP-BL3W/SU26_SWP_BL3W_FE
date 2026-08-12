import { GuestLandingView } from "@/views/GuestLandingView";

// Route trong app/ luôn giữ MỎNG — chỉ render View tương ứng, không chứa logic.
export default function Home() {
  return <GuestLandingView />;
}
