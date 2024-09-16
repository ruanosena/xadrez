/** @type {import("prettier").Config} */
const config = {
  printWidth: 120,
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindFunctions: ["cn"],
};

export default config;
