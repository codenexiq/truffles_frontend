import { BlogEditorScreen } from "@/components/dashboard/blog/BlogEditorScreen";

// Waits for the sign-in check before showing anything, so it is not an "instant" page (see ../../../layout.tsx).
export const instant = false;

export default function BlogEditorPage() {
  return <BlogEditorScreen />;
}
