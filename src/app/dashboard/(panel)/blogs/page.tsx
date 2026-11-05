import { BlogsScreen } from "@/components/dashboard/blog/BlogsScreen";

// Waits for the sign-in check before showing anything, so it is not an "instant" page (see ../../layout.tsx).
export const instant = false;

export default function BlogsPage() {
  return <BlogsScreen />;
}
