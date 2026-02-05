import { createBrowserRouter } from "react-router";
import { Level1New } from "./components/Level1New";
import { Level2Used } from "./components/Level2Used";
import { Level3Vintage } from "./components/Level3Vintage";

export type Language = "ja" | "en";

const defaultLang: Language = "ja";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Level1New lang={defaultLang} />,
  },
  {
    path: "/level2",
    element: <Level2Used lang={defaultLang} />,
  },
  {
    path: "/level3",
    element: <Level3Vintage lang={defaultLang} />,
  },
]);