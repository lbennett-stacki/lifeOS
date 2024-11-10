"use client";

import dynamic from "next/dynamic";
import { Spinner } from "../icons/Spinner";
import { Button } from "@/shadcn/components/ui/button";

export const ThemeToggle = dynamic(
  () =>
    import("./client/ThemeToggleClient").then((mod) => mod.ThemeToggleClient),
  {
    ssr: false,
    loading: () => {
      return (
        <Button variant="outline" size="icon">
          <Spinner className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <span className="sr-only">Loading theme</span>
        </Button>
      );
    },
  },
);
