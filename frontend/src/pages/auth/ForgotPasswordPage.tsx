import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Container,
  Alert,
  Link,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import AuthPage from "./AuthPage";
import { forgotPassword } from "../../services/Auth";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await forgotPassword(email);
      setSuccess(response.message || t("auth.reset_email_sent"));
    } catch (err: any) {
      setError(err.response?.data?.detail || t("auth.error_generic"));
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
            {t("auth.forgot_password")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: "center" }}>
            {t("auth.forgot_password_desc")}
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t("auth.email")}
              name="email"
              autoComplete="email"
              autoFocus
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading || !email}
            >
              {loading ? t("common.loading") : t("auth.send_reset_link")}
            </Button>
            
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {success}
              </Alert>
            )}
            
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Link href="/login" underline="hover">
                {t("auth.back_to_login")}
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </AuthPage>
  );
}
