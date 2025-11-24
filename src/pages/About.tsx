import { Box, Typography, Container } from "@mui/material";

export default function AboutPage() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
          textAlign: "center",
          gap: 3,
          color: "white",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#FFC400", mt: 2 }}
        >
          درباره ما
        </Typography>

        <Typography variant="body1" sx={{ lineHeight: 2, fontSize: "1.1rem" }}>
          این پروژه با هدف ساده‌سازی فرآیند ساخت فرم‌های پیچیده و مدیریت داده‌ها
          طراحی شده است.
          <br />
          با استفاده از هوش مصنوعی، شما می‌توانید ساختارهای داده‌ای خود را تنها
          با گفتگو ایجاد کنید.
        </Typography>

        <Typography variant="body2" sx={{ color: "grey.500", mt: 4 }}>
          نسخه ۱.۰.۰
        </Typography>
      </Box>
    </Container>
  );
}
