// src/app/routes.tsx

import { createBrowserRouter } from "react-router";
// 相対パスに修正
import { Level1New } from "./components/Level1New";
import { Level2Used } from "./components/Level2Used";
import { Level3Vintage } from "./components/Level3Vintage";

// "jp" ではなく "ja" を定義します
export type Language = "ja" | "en";

// ここも "ja" にします
const defaultLang: Language = "ja";

export const router = createBrowserRouter([
  {
    path: "/",
    // elementプロパティを使用し、langを渡す
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