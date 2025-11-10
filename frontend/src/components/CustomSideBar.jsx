// Sidebar.jsx
import React, { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { FaChevronLeft, FaChevronRight, FaSignOutAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router";
import { useLogout } from "@/hooks/useLogout";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";

const extractPath = (fullPath, basePath) => {
  let relativePath = fullPath.startsWith(basePath)
    ? fullPath.slice(basePath.length)
    : fullPath;

  // Remove leading slash if exists
  if (relativePath.startsWith("/")) relativePath = relativePath.slice(1);

  // Split by "/" and return the first segment
  const segments = relativePath.split("/");
  return segments[0] || "";
};
const CustomSidebar = ({ menuData, basePath }) => {
  const primaryColor = "var(--color-primary)";
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null); // For top menu
  const [bottomHovered, setBottomHovered] = useState(null); // 0: Logout, 1: Collapse
  const location = useLocation();
  const navigate = useNavigate();

  const { logout } = useLogout();

  const menuItemStyle = {
    borderRadius: "50px",
    fontWeight: 600,
    marginBottom: "8px",
    transition: "all 0.2s ease",
    cursor: "pointer",
  };

  const iconStyle = (isActiveOrHovered) =>
    collapsed
      ? {
          marginLeft: "-12px",
          color: isActiveOrHovered ? primaryColor : "white",
        }
      : { color: isActiveOrHovered ? primaryColor : "white" };

  const getMenuItemColors = (isActiveOrHovered) => ({
    color: isActiveOrHovered ? primaryColor : "white",
    backgroundColor: isActiveOrHovered ? "white" : "transparent",
  });

  return (
    <Sidebar
      collapsed={collapsed}
      style={{
        height: "85vh",
        backgroundColor: primaryColor,
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "10px",
        width: collapsed ? "80px" : "250px",
        borderBottomRightRadius: "2rem", // Rounded top-left corner
        borderTopRightRadius: "2rem", // Rounded bottom-left corner
        transition: "width 0.3s ease", // Smooth collapse/expand
        overflow: "hidden", // Hide overflowing content when collapsed
      }}
    >
      {/* Top Menu Items */}
      <Menu iconShape="circle">
        {menuData.map((item, idx) => {
          const isHovered = hoveredIndex === idx;
          const isActive =
            extractPath(location.pathname, basePath) === item.path;
          if (item.subMenu) {
            return (
              <SubMenu
                key={idx}
                label={item.title}
                icon={
                  item.icon ? (
                    <item.icon
                      size={25}
                      style={iconStyle(isActive || isHovered)}
                    />
                  ) : null
                }
                style={{
                  ...menuItemStyle,
                  ...getMenuItemColors(isActive || isHovered),
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {item.subMenu.map((subItem, subIdx) => {
                  const subIsActive = subItem.path === location.pathname;
                  return (
                    <MenuItem
                      key={subIdx}
                      onClick={() => navigate(subItem.path)}
                      icon={
                        subItem.icon ? (
                          <subItem.icon
                            size={25}
                            style={iconStyle(subIsActive || isHovered)}
                          />
                        ) : null
                      }
                      style={{
                        // ...menuItemStyle,
                        ...getMenuItemColors(subIsActive || isHovered),
                      }}
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {subItem.title}
                    </MenuItem>
                  );
                })}
              </SubMenu>
            );
          }

          return (
            <MenuItem
              key={idx}
              onClick={() => navigate(item.path)}
              icon={
                item.icon ? (
                  <item.icon
                    size={25}
                    style={iconStyle(isActive || isHovered)}
                  />
                ) : null
              }
              style={{
                ...menuItemStyle,
                ...getMenuItemColors(isActive || isHovered),
              }}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {item.title}
            </MenuItem>
          );
        })}
      </Menu>

      {/* Bottom Actions */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Menu iconShape="circle">
          {/* Logout */}
          <MenuItem
            icon={
              <FaSignOutAlt size={25} style={iconStyle(bottomHovered === 0)} />
            }
            style={{
              ...menuItemStyle,
              ...getMenuItemColors(bottomHovered === 0),
              width: "100%",
            }}
            onClick={() => logout()}
            onMouseEnter={() => setBottomHovered(0)}
            onMouseLeave={() => setBottomHovered(null)}
          >
            {collapsed ? "" : "Logout"}
          </MenuItem>

          {/* Collapse */}
          <MenuItem
            icon={
              collapsed ? (
                <GoSidebarCollapse
                  size={25}
                  style={iconStyle(bottomHovered === 1)}
                />
              ) : (
                <GoSidebarExpand
                  size={25}
                  style={iconStyle(bottomHovered === 1)}
                />
              )
            }
            style={{
              ...menuItemStyle,
              ...getMenuItemColors(bottomHovered === 1),
              width: "100%",
              textAlign: "center",
            }}
            onClick={() => setCollapsed(!collapsed)}
            onMouseEnter={() => setBottomHovered(1)}
            onMouseLeave={() => setBottomHovered(null)}
          ></MenuItem>
        </Menu>
      </div>
    </Sidebar>
  );
};

export default CustomSidebar;
