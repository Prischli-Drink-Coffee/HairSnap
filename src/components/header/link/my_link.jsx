import React from "react";
import { NavLink } from "react-router-dom";
import style from "./link.module.css";

const MyLink = ({ to, name, onClick }) => {
  return (
    <NavLink
      onClick={onClick}
      className={({ isActive }) =>
        isActive ? `${style.Link__active} ${style.Link}` : style.Link
      }
      to={to}
    >
      {name}
    </NavLink>
  );
};

export default MyLink;
