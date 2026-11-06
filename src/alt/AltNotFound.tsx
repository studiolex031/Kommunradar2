import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { BrandMark } from "@/components/brand/BrandLogo";

const AltNotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center">
        <BrandMark decorative className="mx-auto mb-6 h-16 w-16 shadow-lg shadow-kr-navy/15 rounded-[22%]" />
        <h1 className="mb-2 text-4xl font-bold text-kr-navy">404</h1>
        <p className="mb-6 text-lg text-muted-foreground">Sidan kunde inte hittas.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-kr-navy"
        >
          <ArrowLeft size={16} aria-hidden />
          Till översikten
        </Link>
      </div>
    </div>
  );
};

export default AltNotFound;
