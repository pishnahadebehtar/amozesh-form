import React from "react";
import { Box, TextField, IconButton, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import type { ChatMessage } from "./ChatHistory";
import { agent } from "@/lib/agent";

interface InputSectionProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  onNewMessage: (msg: ChatMessage) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  loadHistory: () => Promise<void>;
  showSnackbar?: (
    msg: string,
    severity?: "success" | "error" | "info" | "warning"
  ) => void;
}

export function InputSection({
  inputRef,
  value,
  onChange,
  onClick,
  onNewMessage,
  isLoading,
  setIsLoading,
  loadHistory,
  showSnackbar,
}: InputSectionProps) {
  const startPollingForAssistantResponse = () => {
    let pollCount = 0;
    const maxPolls = 30;
    const poll = async () => {
      await loadHistory();
      pollCount++;
      if (pollCount < maxPolls) setTimeout(poll, 1000);
      else showSnackbar?.("پاسخ با تأخیر دریافت شد یا خطایی رخ داد", "warning");
    };
    setTimeout(poll, 1000);
  };

  const handleSend = async () => {
    if (!value.trim() || isLoading) return;
    onClick();
    setIsLoading(true);
    try {
      const result = await agent(value);
      if (result && result.text_answer) {
        onNewMessage({ role: "assistant", text: result.text_answer });
      } else {
        showSnackbar?.("در حال پردازش درخواست شما...", "info");
        startPollingForAssistantResponse();
      }
    } catch (error) {
      console.error("Agent call failed:", error);
      showSnackbar?.("در حال پردازش... (اتصال برقرار شد)", "info");
      startPollingForAssistantResponse();
    } finally {
      setIsLoading(false);
      onChange({
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        alignItems: "center",
        // FIXED: Force 100% width regardless of parent padding

        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        px: { xs: 0, sm: 0 }, // Ensure no internal padding on mobile
      }}
    >
      <IconButton
        onClick={handleSend}
        disabled={isLoading}
        sx={{
          borderRadius: "50%",
          width: 56,
          height: 56,
          bgcolor: "#FFC400",
          color: "black",
          "&:hover": { bgcolor: "#E6B800" },
          "&:disabled": { bgcolor: "#666", opacity: 0.7 },
          order: -1,
          flexShrink: 0,
          // Fix dimming on mobile
          filter: "brightness(100%) contrast(100%)",
          isolation: "isolate",
        }}
      >
        {isLoading ? (
          <CircularProgress size={28} sx={{ color: "black" }} />
        ) : (
          <SendIcon sx={{ fontSize: 32, transform: "rotate(180deg)" }} />
        )}
      </IconButton>

      <TextField
        inputRef={inputRef}
        fullWidth
        value={value}
        onChange={onChange}
        placeholder="بگو چی می‌خوای..."
        dir="rtl"
        disabled={isLoading}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !isLoading) {
            e.preventDefault();
            handleSend();
          }
        }}
        sx={{
          flexGrow: 1,
          "& .MuiOutlinedInput-root": {
            borderRadius: 28,
            backgroundColor: "grey.800",
            color: "white",
            "& fieldset": { borderColor: "grey.600" },
            "&:hover fieldset": { borderColor: "grey.400" },
            "&.Mui-focused fieldset": { borderColor: "#FFC400" },
          },
        }}
        InputProps={{ style: { color: "white" } }}
      />
    </Box>
  );
}
