import { createBrowserRouter } from "react-router";
import { Level1New } from "@/app/components/Level1New";
import { Level2Used } from "@/app/components/Level2Used";
import { Level3Vintage } from "@/app/components/Level3Vintage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Level1New,
  },
  {
    path: "/level2",
    Component: Level2Used,
  },
  {
    path: "/level3",
    Component: Level3Vintage,
  },
]);
