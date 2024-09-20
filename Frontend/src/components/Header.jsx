import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/webs-log.png";
import AvatarWithUserDropdown from "../components/AvatarWithUserDropdown";
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
  Input,
  Button,
} from "@material-tailwind/react";
import { HiBars3, HiOutlineXMark } from "react-icons/hi2";
import { CiSearch, CiShoppingCart } from "react-icons/ci";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
          <ul className="grid gap-y-2 outline-none outline-0">{renderItems}</ul>
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
      <NavListMenu
        label="LADIES FOOTWEAR"
        menuItems={ladiesFootWearMenuItems}
      />
      <NavListMenu label="NEW ARRIVALS 24" menuItems={newArrivalsMenuItems} />
      <NavListMenu label="SALE" menuItems={saleMenuItems} />
    </List>
  );
}

const Header = ({ onSearchClick, searchVisible }) => {
  const [openNav, setOpenNav] = useState(false);
  const [navbarPosition, setNavbarPosition] = useState("top-8");
  const [navbarHeight, setNavbarHeight] = useState("h-[8rem]");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userFirstName, setUserFirstName] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserFirstName = async () => {
      try {
        const response = await axios.get("/api/users/get-user-first-name", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserFirstName(response.data.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to fetch user's first name:", error);
        setIsAuthenticated(false);
      }
    };
    fetchUserFirstName();
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setNavbarPosition("top-0");
        setNavbarHeight("h-[4rem]");
      } else {
        setNavbarPosition("top-8");
        setNavbarHeight("h-[8rem]");
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setErrorMessage("Please enter a product name to begin your search.");
      setInterval(() => {
        setErrorMessage("");
      }, 2000);
      return;
    }
    navigate(`/allProducts?search=${encodeURIComponent(searchQuery)}`);
  };
  const handleHomeNavigate = () => {
    navigate("/");
  };

  return (
    <div>
      <h1 className="flex bg-black text-white h-8 justify-center items-center">
        Free Delivery on order Rs.3000/-or above
      </h1>
      <Navbar
        className={`fixed ${navbarPosition} left-0 right-0 z-50 mx-auto max-w-screen-3xl px-4 py-2 ${navbarHeight} transition-all duration-300`}
      >
        <div className="flex items-center justify-between text-blue-gray-900 h-full">
          <div>
            <img
              className={`w-24 sm:w-22 md:w-40 lg:w-30 xl:w-40 2xl:w-54 h-auto transition-all duration-300 cursor-pointer`}
              src={logo}
              onClick={handleHomeNavigate}
              alt="Logo"
            />
          </div>

          <div className="flex flex-1 items-center gap-4 justify-center">
            <div className="hidden lg:block">
              <NavList />
            </div>
            <Typography className="hidden lg:block text-sm">
              Track Your Order
            </Typography>
          </div>
          <div className="flex space-x-4">
            {isAuthenticated ? (
              <>
                {userFirstName && (
                  <Typography className="flex items-center mr-5">
                    {userFirstName}
                  </Typography>
                )}
              </>
            ) : (
              <>
                <NavLink to="/login">
                  <div className="flex justify-center items-center">
                    <div className=" w-2 max-h-6 bg-black sm:h-9 md:h-9 "></div>
                    <Typography className="p-2 text-sm sm:text-sm md:text-sm lg:lg xl:lg ">
                      Sign in
                    </Typography>
                  </div>
                </NavLink>

                <NavLink to="/register">
                  <div className="flex justify-center items-center">
                    <div className="w-2 max-h-6 bg-black  sm:h-9 md:h-9 "></div>
                    <Typography className="p-2 text-sm sm:text-sm md:text-sm lg:lg xl:lg ">
                      Sign Up
                    </Typography>
                  </div>
                </NavLink>
              </>
            )}
          </div>
          <div className="hidden gap-2 lg:flex items-center mr-2">
            <div className="">
              <IconButton className="bg-white" onClick={onSearchClick}>
                <CiSearch style={{ color: "black", fontSize: "2.5em" }} />
              </IconButton>
            </div>

            <div
              className={`absolute inset-x-0 mx-auto w-1/2 bg-white/80 p-2 shadow-lg transition-all duration-500 ease-in-out top-full rounded-sm mt-1  ${
                searchVisible ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
              }`}
              style={{ maxWidth: "600px" }}
            >
              {" "}
              <form onSubmit={handleSearchSubmit} className="flex">
                <Input
                  variant="standard"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  label="Type to search"
                  placeholder="Search by product name"
                  className="w-full p-2 border border-gray-300 rounded-md border-none"
                  min={1}
                />
                <div className="flex flex-col">
                  <Button type="submit" className="">
                    Search
                  </Button>
                </div>
              </form>
              {errorMessage && (
                <p
                  className={`absolute inset-x-0 mx-auto w-2/3 bg-white/80 text-red-500 text-sm text-center font-semibold p-2 shadow-lg transition-all duration-900 ease-in-out top-full rounded-sm mt-1  ${
                    searchVisible ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
                  }`}
                  style={{ maxWidth: "600px" }}
                >
                  {errorMessage}
                </p>
              )}
            </div>
            <IconButton className="bg-white">
              <CiShoppingCart style={{ color: "black", fontSize: "2.5em" }} />
            </IconButton>
          </div>
          <div className="flex items-center">
            <button
              color="white"
              className="lg:hidden mr-1"
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <HiOutlineXMark className="h-6 w-6" strokeWidth={2} />
              ) : (
                <HiBars3 className="h-6 w-6" strokeWidth={2} />
              )}
            </button>
            {isAuthenticated ? (
              <div className="w-full flex items-center justify-center">
                <AvatarWithUserDropdown />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <Collapse open={openNav}>
          <div className="bg-white pb-5">
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
          </div>
        </Collapse>
      </Navbar>
      <div className="pt-[8rem]"></div>
    </div>
  );
};
export default Header;
