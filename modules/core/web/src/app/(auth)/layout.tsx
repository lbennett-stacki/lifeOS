import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="flex justify-end items-center p-4">
        <ThemeToggle />
      </div>

      {children}
    </div>
  );
}
