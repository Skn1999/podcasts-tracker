import { ReactElement } from "react";
import type { LinkProps } from "react-router-dom";
import { Link } from "remix";
import Logo from "./Logo";

const NavItem = ({ children, className, ...props }: LinkProps) => {
  return (
    <Link {...props} className={`hover:text-white ${className}`}>
      {children}
    </Link>
  );
};

export default function Menubar() {
  return (
    <nav className="relative top-5 left-auto right-auto flex items-center justify-start p-4 mx-auto rounded-md overflow-hidden shadow-2xl border-b border-indigo-500 bg-transparent">
      <div className="absolute backdrop-blur-2xl bg-white bg-opacity-5 inset-0 w-full h-full"></div>
      <Logo />

      <ul className="flex items-center justify-end ml-auto space-x-8 relative text-sm">
        <NavItem to="/">Home</NavItem>
        <NavItem to="/about">About</NavItem>
        <NavItem
          to="https://github.com/Skn1999/podcasts-tracker"
          target="_blank"
        >
          Github
        </NavItem>
        <NavItem
          to="/login"
          className="bg-white rounded-md p-2 px-3 font-medium text-indigo-900 hover:shadow-lg hover:text-indigo-900"
        >
          Login
        </NavItem>
      </ul>

      {/* <div className="flex items-center justify-center rounded-full border ml-8 cursor-pointer hover:bg-indigo-700 w-12 h-12 text-lg transition duration-150 border-indigo-200 relative">
        🧑‍🦱
      </div> */}
    </nav>
  );
}
