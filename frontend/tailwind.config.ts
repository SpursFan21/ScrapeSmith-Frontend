import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        metallic: "#4a4a4a",   // Metallic grey background
        hotyellow: "#ffcc00",  // Yellow accent
        hotorange: "#ff6600",  // Orange accent
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        roboto: ["Roboto", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
