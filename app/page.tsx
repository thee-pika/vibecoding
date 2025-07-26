
import User from "@/features/auth/components/User";

export default function Home() {
  console.log("process.env.NEXT_PUBLIC_AUTH_SECRET", process.env.NEXT_PUBLIC_AUTH_SECRET)
  return (
    <div>
      <h1>Hello World</h1>
      <User />
    </div>
  );
}
