import React, { useState, useEffect } from "react";
import logo from "../assets/webs-log.png"
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { CiSearch, CiShoppingCart } from "react-icons/ci";

const gentsFootWearMenuItems = [
  { title: "SHOES" },
  { title: "SANDALS" },
  { title: "SLIPPER" },
  { title: "SNEAKERS" },
];

const ladiesFootWearMenuItems = [
  { title: "SANDALS" },
  { title: "PUMPS" },
  { title: "SNEAKERS" },
  { title: "SHOES" },
];

const newArrivalsMenuItems = [
  { title: "GENTS FOOTWEAR" },
  { title: "LADIES FOOTWEAR" },
];

const saleMenuItems = [
  { title: "GENTS FOOTWEAR" },
  { title: "LADIES FOOTWEAR" },
];

function NavListMenu({ label, menuItems }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderItems = menuItems.map(({ title }, key) => (
    <a href="#" key={key}>
      <MenuItem className="rounded-lg p-2 hover:bg-transparent">
        <Typography
          variant="h6"
          color="blue-gray"
          className="text-sm font-bold"
        >
          {title}
        </Typography>
      </MenuItem>
    </a>
  ));

  return (
    <React.Fragment>
      <Menu
        open={isMenuOpen}
        handler={setIsMenuOpen}
        offset={{ mainAxis: 20 }}
        placement="bottom"
        allowHover={true}
      >
        <MenuHandler>
          <Typography as="div" variant="small" className="font-medium">
            <ListItem
              className="py-2 pr-4 font-medium text-gray-900"
              selected={isMenuOpen || isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((cur) => !cur)}
            >
              {label}
            </ListItem>
          </Typography>
        </MenuHandler>
        <MenuList className="hidden max-w-screen-xl rounded-xl lg:block">
          <ul className="grid gap-y-2 outline-none outline-0">
            {renderItems}
          </ul>
        </MenuList>
      </Menu>
      <div className="block lg:hidden">
        <Collapse open={isMobileMenuOpen}>{renderItems}</Collapse>
      </div>
    </React.Fragment>
  );
}

function NavList() {
  return (
    <List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1">
      <NavListMenu label="GENTS FOOTWEAR" menuItems={gentsFootWearMenuItems} />
      <NavListMenu label="LADIES FOOTWEAR" menuItems={ladiesFootWearMenuItems} />
      <NavListMenu label="NEW ARRIVALS 24" menuItems={newArrivalsMenuItems} />
      <NavListMenu label="SALE" menuItems={saleMenuItems} />
    </List>
  );
}

export function Header() {
  const [openNav, setOpenNav] = useState(false);
  const [navbarPosition, setNavbarPosition] = useState("top-8");
  const [navbarHeight, setNavbarHeight] = useState("h-[8rem]");
  const [logoHeight, setLogoHeight] = useState("h-20");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setNavbarPosition("top-0");
        setNavbarHeight("h-[4rem]");
        setLogoHeight("h-20");
      } else {
        setNavbarPosition("top-8");
        setNavbarHeight("h-[8rem]");
        setLogoHeight("h-36");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  return (
    <div>
      <h1 className="flex bg-red-900 text-white h-8 justify-center items-center">
        Free Delivery on order Rs.3000/-or above
      </h1>
      <Navbar
        className={`fixed ${navbarPosition} left-0 right-0 z-50 mx-auto max-w-screen-3xl px-4 py-2 ${navbarHeight} transition-all duration-300`}
      >
        <div className="flex items-center justify-between text-blue-gray-900 h-full">
          <div>
            <img
              className={`transition-all duration-300 ${logoHeight}`}
              src={logo}
              alt=""
            />
          </div>
          <div className="flex flex-1 items-center gap-4 justify-center">
            <div className="hidden lg:block">
              <NavList />
            </div>
            <Typography className="hidden lg:block">Track Your Order</Typography>
          </div>
          <div className="hidden gap-2 lg:flex items-center">
            <IconButton className="bg-white">
              <CiSearch style={{ color: "black", fontSize: "2.5em" }} />
            </IconButton>
            <IconButton className="bg-white">
              <CiShoppingCart style={{ color: "black", fontSize: "2.5em" }} />
            </IconButton>
          </div>
          <IconButton
            variant="text"
            color="blue-gray"
            className="lg:hidden"
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <XMarkIcon className="h-6 w-6" strokeWidth={2} />
            ) : (
              <Bars3Icon className="h-6 w-6" strokeWidth={2} />
            )}
          </IconButton>
        </div>
        <Collapse open={openNav}>
          <NavList />
          <Typography className="text-black -mt-5 mb-2 ml-3">
            Track Your Order
          </Typography>
          <div className="flex w-full flex-nowrap items-center gap-2 lg:hidden">
            <IconButton className="bg-white">
              <CiSearch style={{ color: "black", fontSize: "2.5em" }} />
            </IconButton>
            <IconButton className="bg-white">
              <CiShoppingCart style={{ color: "black", fontSize: "2.5em" }} />
            </IconButton>
          </div>
        </Collapse>
      </Navbar>
      <div className="pt-[8rem]">
        {/* Content below the navbar starts here */}
      </div>
    </div>
  );
}
