// app/page.tsx
import { redirect } from "next/navigation";

export default function Page() {
  // Redirige automáticamente a /login cuando se accede a /
  redirect("/login");
}
