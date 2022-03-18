import { User } from "@prisma/client";
import type { LinkProps } from "react-router-dom";
import { Link, useLoaderData } from "remix";
import Logo from "./Logo";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useCallback, useRef, useState } from "react";

type Props = {
  user?: User | null;
};

const NavItem = ({ children, className, ...props }: LinkProps) => {
  return (
    <Link {...props} className={`hover:text-white ${className}`}>
      {children}
    </Link>
  );
};

export default function Menubar({ user }: Props = { user: null }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const ref = useRef<HTMLDivElement | null>(null);
  const [refState, setRefState] = useState<HTMLElement | null>(null);
  const ref = useCallback((node) => {
    setRefState(node);
  }, []);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const handleMouseEnter = () => {
    setIsMouseOver(true);
  };
  const handleMouseExit = () => {
    setIsMouseOver(false);
  };
  return (
    <nav className="relative top-5 left-auto right-auto flex items-center justify-start p-6 mx-auto rounded-md overflow-hidden shadow-2xl border-b border-indigo-500 bg-transparent">
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
        {user && user.id ? (
          <form method="post" action="/logout">
            <button
              type="submit"
              ref={ref}
              className="font-sm text-white font-medium flex items-center justify-center p-4 -my-4 -mr-4 rounded hover:bg-indigo-100 hover:bg-opacity-20 transition-all duration-200 cursor-pointer group"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseExit}
              style={{
                minWidth: refState?.getBoundingClientRect().width ?? 0,
                textAlign: "center",
              }}
            >
              <p>{isMouseOver ? "Logout" : "🧑‍🦱 " + user.fullName}</p>
              {/* <span className="w-4 h-4 ml-2">
              <ChevronDownIcon className="w-full h-full text-white" />
            </span> */}
              {/* <Modal
              isOpen={isModalOpen}
              horizontalAlign="right"
              verticalAlign="bottom"
              anchorRef={ref}
            >
              <li>Some thing</li>
            </Modal> */}
            </button>
          </form>
        ) : (
          <NavItem
            to="/login"
            className="bg-white rounded-md p-2 px-3 font-medium text-indigo-900 hover:shadow-lg hover:text-indigo-900"
          >
            Login
          </NavItem>
        )}
      </ul>

      {/* <div className="flex items-center justify-center rounded-full border ml-8 cursor-pointer hover:bg-indigo-700 w-12 h-12 text-lg transition duration-150 border-indigo-200 relative">
        🧑‍🦱
      </div> */}
    </nav>
  );
}
