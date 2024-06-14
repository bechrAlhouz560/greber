export const globalColors = [
  "#d29034",
  "#0079BF",
  "#519839",
  "#89609e",
  "#0D7377",
  "#c75151",
  "#222832" /* "#161853" */,
  ,
  "#25ECB7",
  "#F05655",
  "#292C6D",

  "linear-gradient(50deg, #9796f0, #fbc7d4)",
  "linear-gradient(50deg, #c31432, #240b36)",
  "linear-gradient(50deg, #ff0099, #493240)",
  "linear-gradient(50deg, #519839, #0D7377)",
  "linear-gradient(50deg, #161853, #292C6D)",
];

export function isDev() {
  return process.env.ELECTRON_ENV === "dev";
}
