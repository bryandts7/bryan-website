import React, { useState, useEffect } from "react";
import { Layout, Button, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import LeftMenu from "./LeftMenu";
import "../../styles/font.css";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false); // Track if the screen is mobile size
  const [visible, setVisible] = useState(false);   // For controlling Drawer visibility

  // Handle screen resizing to toggle between mobile and desktop modes
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768); // Set mobile breakpoint (768px)
  };

  useEffect(() => {
    // Set the initial state
    handleResize();

    // Add event listener to watch for screen resizing
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle drawer visibility for mobile menu
  const showDrawer = () => setVisible(true);
  const closeDrawer = () => setVisible(false);

  return (
    <nav className="navbar">
      <Layout>
        <Layout.Header className="bg-gray-900 text-white">
          <div className="flex justify-between items-center w-full">
            {/* Left Side: Logo */}
            <div className="logo">
              <a href="/">
                <h3 className="font-pixelify-sans text-2xl">Bryan Delton</h3>
              </a>
            </div>

            {/* Right Side: Menu or Drawer Button */}
            <div>
              {isMobile ? (
                <>
                  {/* Button for mobile menu */}
                  <Button
                    type="primary"
                    className="bg-transparent border-none text-white text-2xl"
                    onClick={showDrawer}
                    icon={<MenuOutlined />}
                  />
                  
                  {/* Drawer for mobile menu */}
                  <Drawer
                    title="Menu"
                    placement="left"
                    onClose={closeDrawer}
                    visible={visible}
                  >
                    <LeftMenu mode="vertical" />
                  </Drawer>
                </>
              ) : (
                <div className="flex">
                  {/* Horizontal Menu for desktop */}
                  <LeftMenu mode="horizontal" />
                </div>
              )}
            </div>
          </div>
        </Layout.Header>
      </Layout>
    </nav>
  );
};

export default Navbar;

