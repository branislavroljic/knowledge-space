import { uniqueId } from "lodash";

interface MenuitemsType {
  [x: string]: any;
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: string;
  children?: MenuitemsType[];
  chip?: string;
  chipColor?: string;
  variant?: string;
  external?: boolean;
}

import QuizIcon from "@mui/icons-material/Quiz";
import { AccountTree } from "@mui/icons-material";

const Menuitems = () =>
  [
    {
      navlabel: true,
      subheader: "Knowledge space graph",
    },
    {
      id: uniqueId(),
      title: "KS graph",
      icon: AccountTree,
      href: "/",
    },
    {
      id: uniqueId(),
      title: "Assessment tests",
      icon: QuizIcon,
      href: "/assessment_tests",
    },
    {
      id: uniqueId(),
      title: "Knowledge spaces",
      icon: QuizIcon,
      href: "/knowledge_spaces",
    },
  ] as MenuitemsType[];

export default Menuitems;
