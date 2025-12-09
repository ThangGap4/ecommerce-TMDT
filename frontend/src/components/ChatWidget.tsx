import React, { useState, useRef, useEffect } from "react";
import {
  Fab,
  Paper,
  Box,
  Typography,
  TextField,
  IconButton,
  Slide,
  CircularProgress,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { useTranslation } from "react-i18next";
import ChatService, { ChatMessage } from "../services/Chat";

export default function ChatWidget() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await ChatService.sendMessage(newMessages);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: t("chat.error", "Sorry, something went wrong. Please try again."),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Window */}
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: 90,
            right: 20,
            width: { xs: "calc(100% - 40px)", sm: 380 },
            height: 500,
            maxHeight: "70vh",
            display: "flex",
            flexDirection: "column",
            zIndex: 1300,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "white",
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">{t("chat.title", "Support Chat")}</Typography>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              bgcolor: "#f5f5f5",
            }}
          >
            {messages.length === 0 && (
              <Typography color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
                {t("chat.welcome", "Hi! How can we help you today?")}
              </Typography>
            )}

            {messages.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    bgcolor: msg.role === "user" ? "primary.main" : "white",
                    color: msg.role === "user" ? "white" : "text.primary",
                    borderRadius: 2,
                    borderBottomRightRadius: msg.role === "user" ? 0 : 2,
                    borderBottomLeftRadius: msg.role === "assistant" ? 0 : 2,
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                    {msg.content}
                  </Typography>
                </Paper>
              </Box>
            ))}

            {loading && (
              <Box sx={{ alignSelf: "flex-start" }}>
                <Paper elevation={1} sx={{ p: 1.5, bgcolor: "white", borderRadius: 2 }}>
                  <CircularProgress size={20} />
                </Paper>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <Box sx={{ p: 2, borderTop: 1, borderColor: "divider", bgcolor: "white" }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder={t("chat.placeholder", "Type a message...")}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                autoComplete="off"
              />
              <IconButton
                color="primary"
                onClick={handleSend}
                disabled={!input.trim() || loading}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Slide>

      {/* Floating Button */}
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setOpen(!open)}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1200,
        }}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </Fab>
    </>
  );
}
