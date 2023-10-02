import { Fragment } from "react";
import { Menu } from "antd";
import type { MenuProps } from "antd";

function Header() {
  const menuLabels = [
    "About",
    "Education",
    "Skills",
    "Portfolio",
    "Services",
    "Resume",
    "Blog",
    "Contact",
  ];
  const menuItems: MenuProps["items"] = menuLabels.map((label, index) => ({
    key: index.toString(),
    label,
  }));
  return (
    <Fragment>
      <div className="logo">
        <a href="/">MW</a>
      </div>
      <Menu mode="horizontal" items={menuItems} />
    </Fragment>
  );
}

export default Header;
