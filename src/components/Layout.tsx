import React from "react";
import { Box, AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { Link, Outlet, useLocation } from "react-router-dom";
import YouTubeIcon from "@mui/icons-material/YouTube";
import GitHubIcon from "@mui/icons-material/GitHub";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";

export default function Layout() {
  const location = useLocation();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#000000", // Force background
      }}
    >
      {/* --- MENU BAR --- */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "transparent",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", direction: "rtl" }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Link to="/">
              <IconButton
                sx={{ color: location.pathname === "/" ? "#FFC400" : "white" }}
              >
                <HomeIcon />
              </IconButton>
            </Link>
            <Link to="/about">
              <IconButton
                sx={{
                  color: location.pathname === "/about" ? "#FFC400" : "white",
                }}
              >
                <InfoIcon />
              </IconButton>
            </Link>
          </Box>

          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "white",
              fontFamily: "FarNazanin",
            }}
          >
            مادر فرم‌ها
          </Typography>
        </Toolbar>
      </AppBar>

      {/* --- PAGE CONTENT --- */}
      <Box sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      {/* --- FOOTER --- */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          bgcolor: "#000000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
        }}
      >
        <a
          href="https://www.youtube.com/@pishnahadebehtar"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "white" }}
        >
          <YouTubeIcon sx={{ fontSize: 30, "&:hover": { color: "#FF0000" } }} />
        </a>
        <a
          href="https://github.com/pishnahadebehtar/mother-of-all-forms"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "white" }}
        >
          <GitHubIcon
            sx={{ fontSize: 28, "&:hover": { color: "#ffffffaa" } }}
          />
        </a>
      </Box>
    </Box>
  );
}
