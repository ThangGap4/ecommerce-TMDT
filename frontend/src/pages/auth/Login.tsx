import React, { useState } from "react";
import { Typography, TextField, Button, Box, Container, Alert, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthPage from "./AuthPage";
import { login } from "../../services/Auth";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login({ email, password });
      setUser(response.user);
      
      // Redirect theo role
      if (response.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Dang nhap that bai");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPage>
      <Container maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 4,
          }}
        >
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? "Dang xu ly..." : "Dang nhap"}
            </Button>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Link href="/forgot-password" underline="hover">
                Quen mat khau?
              </Link>
            </Box>
            <Box sx={{ textAlign: "center", mt: 1 }}>
              <Link href="/register" underline="hover">
                Chua co tai khoan? Dang ky ngay
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </AuthPage>
  );
}
