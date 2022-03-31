import { useEffect } from "react";
import { Button } from "./Button";

const toggleDarkMode = () => {
  switch (localStorage.theme) {
    case "light":
      localStorage.theme = "dark";
      break;
    case "dark":
    default:
      localStorage.theme = "light";
      break;
  }
};
export const DarkModeToggle = () => {
  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  return (
    <div className="flex flex-inline place-content-start place-items-center p-2 space-x-2 bg-stone-800">
      <Button onClick={toggleDarkMode}>Light/Dark</Button>
    </div>
  );
};
