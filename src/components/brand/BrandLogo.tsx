import type { SVGProps } from "react";

/**
 * Kommunradar.online – logotyper från varumärkespaketet.
 *
 * Ordmärkena ritas som inline-SVG så att texten renderas med webbplatsens
 * självhostade Inter-typsnitt (en <img>-SVG kan inte använda sidans typsnitt).
 * Geometrin är identisk med paketets SVG-filer; viewBox är beskuren tätt runt
 * motivet så att logotypen kan placeras exakt i header och meny.
 *
 * Original-SVG:erna finns även som statiska filer i /public/brand/.
 */

export type WordmarkVariant = "radar" | "network" | "signal";
export type LogoTone = "light" | "dark";

const BRAND_NAME = "Kommunradar.online";

const palette = {
  navy: "var(--kr-navy)",
  blue: "var(--kr-blue)",
  cyan: "var(--kr-cyan)",
  teal: "var(--kr-teal)",
  yellow: "var(--kr-yellow)",
  white: "var(--kr-white)",
};

/** Tätt beskurna viewBox-värden (uppmätta mot Inter, 8 enheters marginal). */
const VIEWBOX: Record<WordmarkVariant, { box: string }> = {
  radar: { box: "53 17 987 198" },
  network: { box: "53 21 987 204" },
  signal: { box: "48 17 1000 218" }, // kursiv: importera även "@fontsource-variable/inter/wght-italic.css" vid byte
};

interface BrandLogoProps extends Omit<SVGProps<SVGSVGElement>, "viewBox"> {
  variant?: WordmarkVariant;
  /** "light" = för ljus bakgrund (marinblå text), "dark" = för mörk bakgrund (vit text). */
  tone?: LogoTone;
  /** Sätt till true när logotypen ligger i en länk som redan har ett tillgängligt namn. */
  decorative?: boolean;
}

export const BrandLogo = ({
  variant = "radar",
  tone = "light",
  decorative = false,
  className,
  ...props
}: BrandLogoProps) => {
  const wordColor = tone === "dark" ? palette.white : palette.navy;
  // ".online": blå på ljus yta, cyan på mörk yta (6.8:1 mot marinblå)
  const suffixColor =
    variant === "network"
      ? palette.teal
      : tone === "dark"
        ? palette.cyan
        : palette.blue;

  const a11y = decorative
    ? { "aria-hidden": true as const, focusable: "false" as const }
    : { role: "img", "aria-label": BRAND_NAME };

  const textStyle = { fontFamily: "var(--kr-font-web)" };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={VIEWBOX[variant].box}
      className={className}
      {...a11y}
      {...props}
    >
      {!decorative && <title>{BRAND_NAME}</title>}

      {variant === "radar" && (
        <>
          <g fill="none" stroke={palette.blue} strokeWidth="13" strokeLinecap="round">
            <path d="M90 104a72 72 0 0 1 144 0" />
            <path d="M112 104a50 50 0 0 1 100 0" />
            <path d="M134 104a28 28 0 0 1 56 0" />
          </g>
          <circle cx="162" cy="104" r="10" fill={palette.yellow} />
          <text x="55" y="205" fontSize="102" fontWeight="750" letterSpacing="-4" fill={wordColor} style={textStyle}>
            Kommunradar
            <tspan fill={suffixColor} fontWeight="600">.online</tspan>
          </text>
        </>
      )}

      {variant === "network" && (
        <>
          <g fill="none" stroke={palette.cyan} strokeWidth="9" strokeLinecap="round">
            <path d="M90 92L145 48L204 88L252 42" />
            <path d="M145 48L165 116L204 88" />
          </g>
          <circle cx="90" cy="92" r="13" fill={palette.blue} />
          <circle cx="145" cy="48" r="13" fill={palette.teal} />
          <circle cx="204" cy="88" r="13" fill={palette.blue} />
          <circle cx="252" cy="42" r="13" fill={palette.yellow} />
          <circle cx="165" cy="116" r="11" fill={palette.cyan} />
          <text x="55" y="215" fontSize="102" fontWeight="750" letterSpacing="-4" fill={wordColor} style={textStyle}>
            Kommunradar
            <tspan fill={suffixColor} fontWeight="600">.online</tspan>
          </text>
        </>
      )}

      {variant === "signal" && (
        <>
          <g fill="none" strokeLinecap="round" strokeWidth="15">
            <path d="M65 122Q132 18 255 36" stroke={palette.blue} />
            <path d="M91 137Q145 57 235 70" stroke={palette.cyan} />
            <path d="M119 151Q161 94 216 103" stroke={palette.yellow} />
          </g>
          <text
            x="55"
            y="225"
            fontSize="102"
            fontStyle="italic"
            fontWeight="750"
            letterSpacing="-4"
            fill={wordColor}
            style={textStyle}
          >
            Kommunradar
            <tspan fill={suffixColor} fontWeight="600">.online</tspan>
          </text>
        </>
      )}
    </svg>
  );
};

interface BrandMarkProps extends SVGProps<SVGSVGElement> {
  decorative?: boolean;
}

/** Appikonen utan ordmärke – för små kvadratiska ytor (mobilheader, favicon m.m.). */
export const BrandMark = ({ decorative = false, ...props }: BrandMarkProps) => {
  const a11y = decorative
    ? { "aria-hidden": true as const, focusable: "false" as const }
    : { role: "img", "aria-label": BRAND_NAME };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...a11y} {...props}>
      {!decorative && <title>{BRAND_NAME}</title>}
      <rect width="512" height="512" rx="112" fill={palette.navy} />
      <g fill="none" strokeLinecap="round" strokeWidth="26">
        <path d="M110 286a146 146 0 0 1 292 0" stroke={palette.blue} />
        <path d="M160 286a96 96 0 0 1 192 0" stroke={palette.cyan} />
        <path d="M210 286a46 46 0 0 1 92 0" stroke={palette.teal} />
      </g>
      <circle cx="256" cy="286" r="22" fill={palette.yellow} />
    </svg>
  );
};

/** Dekorativa radarbågar (från appikonens motiv) för bakgrunder. Alltid aria-hidden. */
export const RadarArcs = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="96 126 320 174"
    className={`kr-radar-arcs ${className ?? ""}`}
    aria-hidden
    focusable="false"
    {...props}
  >
    <g fill="none" strokeLinecap="round" strokeWidth="14">
      <path d="M110 286a146 146 0 0 1 292 0" stroke={palette.blue} />
      <path d="M160 286a96 96 0 0 1 192 0" stroke={palette.cyan} />
      <path d="M210 286a46 46 0 0 1 92 0" stroke={palette.teal} />
    </g>
    <circle cx="256" cy="286" r="14" fill={palette.yellow} />
  </svg>
);

export default BrandLogo;
