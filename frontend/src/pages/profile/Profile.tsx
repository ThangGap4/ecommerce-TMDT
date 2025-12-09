import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Avatar,
  Breadcrumbs,
  Link,
  InputAdornment,
} from "@mui/material";
import {
  Home,
  Person,
  Email,
  CalendarMonth,
  Edit,
  Lock,
  Badge,
  Phone,
  LocationOn,
  Logout,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { updateProfile, changePassword, IProfileUpdate, IPasswordChange } from "../../services/Auth";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import CurrencySwitcher from "../../components/CurrencySwitcher";

export default function Profile() {
  const { t } = useTranslation();
  const { user, isLoggedIn, setUser, logout } = useAuth();
  const navigate = useNavigate();

  // Profile form state
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || "");
  const [address, setAddress] = useState(user?.address || "");
  
  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setPhoneNumber(user.phone_number || "");
      setAddress(user.address || "");
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setLoading(true);

    try {
      const data: IProfileUpdate = {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        address: address,
      };
      const updatedUser = await updateProfile(data);
      setUser(updatedUser);
      setProfileSuccess(t("profile.updated"));
    } catch (err: any) {
      const key = err.response?.data?.detail;
      setProfileError(key ? t(key) : t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError(t("profile.password_mismatch"));
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(t("profile.password_too_short"));
      return;
    }

    setLoading(true);

    try {
      const data: IPasswordChange = {
        current_password: currentPassword,
        new_password: newPassword,
      };
      await changePassword(data);
      setPasswordSuccess(t("profile.password_changed"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const key = err.response?.data?.detail;
      setPasswordError(key ? t(key) : t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  const userInitials = `${user.first_name?.charAt(0) || ""}${user.last_name?.charAt(0) || user.email?.charAt(0) || "U"}`.toUpperCase();

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Breadcrumbs + Quick Actions */}
      <Box sx={{ bgcolor: "white", py: 2, borderBottom: "1px solid #eee" }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
            <Breadcrumbs>
              <Link
                underline="hover"
                color="inherit"
                sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                onClick={() => navigate("/")}
              >
                <Home sx={{ mr: 0.5 }} fontSize="small" />
                {t("nav.home")}
              </Link>
              <Typography color="text.primary">{t("profile.title")}</Typography>
            </Breadcrumbs>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <LanguageSwitcher />
              <CurrencySwitcher />
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<Logout />}
                onClick={() => { logout(); navigate("/"); }}
                sx={{ textTransform: "none" }}
              >
                {t("nav.logout")}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Profile Header */}
        <Paper 
          sx={{ 
            p: 4, 
            mb: 3, 
            borderRadius: 3,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                fontSize: "2.5rem",
                fontWeight: 700,
                bgcolor: "rgba(255,255,255,0.2)",
                border: "4px solid rgba(255,255,255,0.3)",
              }}
            >
              {userInitials}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1, flexWrap: "wrap" }}>
                <Typography variant="h4" fontWeight={700}>
                  {user.first_name && user.last_name 
                    ? `${user.first_name} ${user.last_name}` 
                    : user.email?.split("@")[0]
                  }
                </Typography>
                <Chip 
                  icon={<Badge sx={{ color: "inherit", fontSize: 16 }} />}
                  label={user.role?.toUpperCase()} 
                  sx={{ 
                    bgcolor: user.role === "admin" ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.15)",
                    color: "white",
                    fontWeight: 600,
                  }}
                  size="small" 
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap", opacity: 0.9 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Email fontSize="small" />
                  <Typography>{user.email}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarMonth fontSize="small" />
                  <Typography>{t("profile.member_since")}: {new Date().toLocaleDateString()}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {/* Profile Update Form */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, borderRadius: 3, height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: "#667eea15",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Edit sx={{ color: "#667eea" }} />
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  {t("profile.update_info")}
                </Typography>
              </Box>

              {profileError && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {profileError}
                </Alert>
              )}
              {profileSuccess && (
                <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                  {profileSuccess}
                </Alert>
              )}

              <Box component="form" onSubmit={handleProfileSubmit}>
                <TextField
                  fullWidth
                  label={t("auth.first_name")}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    "& .MuiOutlinedInput-root": { borderRadius: 2 }
                  }}
                />
                <TextField
                  fullWidth
                  label={t("auth.last_name")}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    "& .MuiOutlinedInput-root": { borderRadius: 2 }
                  }}
                />
                <TextField
                  fullWidth
                  label={t("profile.phone_number")}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  margin="normal"
                  placeholder="0912 345 678"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    "& .MuiOutlinedInput-root": { borderRadius: 2 }
                  }}
                />
                <TextField
                  fullWidth
                  label={t("profile.address")}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  margin="normal"
                  placeholder="123 Main St, District 1, HCM"
                  multiline
                  rows={2}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    "& .MuiOutlinedInput-root": { borderRadius: 2 }
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ 
                    mt: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : t("common.save")}
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Password Change Form */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, borderRadius: 3, height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: "#e9456015",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Lock sx={{ color: "#e94560" }} />
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  {t("profile.change_password")}
                </Typography>
              </Box>

              {passwordError && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {passwordError}
                </Alert>
              )}
              {passwordSuccess && (
                <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                  {passwordSuccess}
                </Alert>
              )}

              <Box component="form" onSubmit={handlePasswordSubmit}>
                <TextField
                  fullWidth
                  type="password"
                  label={t("profile.current_password")}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    "& .MuiOutlinedInput-root": { borderRadius: 2 }
                  }}
                />
                <TextField
                  fullWidth
                  type="password"
                  label={t("profile.new_password")}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    "& .MuiOutlinedInput-root": { borderRadius: 2 }
                  }}
                />
                <TextField
                  fullWidth
                  type="password"
                  label={t("auth.confirm_password")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    "& .MuiOutlinedInput-root": { borderRadius: 2 }
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ 
                    mt: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    bgcolor: "#e94560",
                    "&:hover": { bgcolor: "#d63651" },
                  }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : t("profile.change_password")}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
