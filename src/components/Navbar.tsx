import { Link } from "@tanstack/react-router";
import { Moon, Sun, Leaf } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };

  const linkClass =
    "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors";
  const activeProps = { className: "text-sm font-medium text-foreground" };

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Leaf className="size-5 text-primary" />
          <span>DataCenter Impact</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className={linkClass} activeProps={activeProps} activeOptions={{ exact: true }}>
            Home
          </Link>
          <Link to="/technologies" className={linkClass} activeProps={activeProps}>
            Technologies
          </Link>
          <Link to="/about" className={linkClass} activeProps={activeProps}>
            About
          </Link>
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        </nav>
      </div>
    </header>
  );
}
