// FILE: src\components\animatedEye\components\ChatHistory.tsx
// Optimized: React.memo + useMemo (no react-window; simple for short histories)
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Box, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";

export type ChatMessage = { role: "user" | "assistant"; text: string };

interface ChatHistoryProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

export default React.memo(function ChatHistory({
  // Skips re-render if props unchanged
  messages,
  isLoading = false,
}: ChatHistoryProps) {
  const chatRef = useRef<HTMLDivElement>(null);
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);

  // Memoize JSX (compute once per messages change)
  const renderedMessages = useMemo(
    () =>
      messages
        .filter((msg) => msg.role === "assistant")
        .map((msg, index) => (
          <Box
            key={`${msg.role}-${index}`}
            sx={{
              p: 2,
              width: "100%",
              bgcolor: "transparent",
              color: "white",
              direction: "rtl",
              opacity: 1,
              transform: "translateY(0)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
              "&:not(:last-child)": {
                animationDelay: `${index * 0.1}s`,
              },
            }}
          >
            <div
              dir="rtl"
              style={{
                direction: "rtl",
                textAlign: "right",
                width: "100%",
                unicodeBidi: "plaintext",
              }}
            >
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1
                      dir="rtl"
                      style={{
                        color: "white",
                        fontSize: "1.5em",
                        margin: "0.5em 0",
                        direction: "rtl",
                        textAlign: "right",
                        unicodeBidi: "plaintext",
                        width: "100%",
                        fontWeight: "bold",
                        lineHeight: 1.2,
                      }}
                    >
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2
                      dir="rtl"
                      style={{
                        color: "white",
                        fontSize: "1.2em",
                        margin: "0.5em 0",
                        direction: "rtl",
                        textAlign: "right",
                        unicodeBidi: "plaintext",
                        width: "100%",
                        fontWeight: "bold",
                        lineHeight: 1.3,
                      }}
                    >
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3
                      dir="rtl"
                      style={{
                        color: "white",
                        fontSize: "1.1em",
                        margin: "0.5em 0",
                        direction: "rtl",
                        textAlign: "right",
                        unicodeBidi: "plaintext",
                        width: "100%",
                        fontWeight: "bold",
                        lineHeight: 1.4,
                      }}
                    >
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p
                      dir="rtl"
                      style={{
                        margin: "0.5em 0",
                        lineHeight: 1.6,
                        direction: "rtl",
                        textAlign: "right",
                        unicodeBidi: "plaintext",
                        width: "100%",
                        color: "white",
                        fontSize: "1em",
                      }}
                    >
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul
                      dir="rtl"
                      style={{
                        margin: "0.5em 0",
                        paddingRight: "1.5em",
                        direction: "rtl",
                        textAlign: "right",
                        width: "100%",
                      }}
                    >
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol
                      dir="rtl"
                      style={{
                        margin: "0.5em 0",
                        paddingRight: "1.5em",
                        direction: "rtl",
                        textAlign: "right",
                        width: "100%",
                      }}
                    >
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li
                      dir="rtl"
                      style={{
                        direction: "rtl",
                        textAlign: "right",
                        marginBottom: "0.25em",
                        width: "100%",
                      }}
                    >
                      {children}
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong style={{ fontWeight: "bold", color: "#FFD700" }}>
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em style={{ fontStyle: "italic", color: "white" }}>
                      {children}
                    </em>
                  ),
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
          </Box>
        )),
    [messages] // Re-compute only if messages change
  );

  const handleScroll = useCallback(() => {
    if (!chatRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
    setShowTopFade(scrollTop > 0);
    setShowBottomFade(scrollTop < scrollHeight - clientHeight - 1);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
    setTimeout(handleScroll, 0);
  }, [renderedMessages.length, isLoading, handleScroll]);

  // Scroll listener
  useEffect(() => {
    const ref = chatRef.current;
    if (ref) {
      ref.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => ref.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // Initial fade
  useEffect(() => {
    if (renderedMessages.length > 0 && chatRef.current) {
      handleScroll();
    }
  }, [renderedMessages, handleScroll]);

  return (
    <Box
      sx={{
        width: "100%",
        height: 200,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "black",
        borderRadius: 1,
      }}
    >
      {/* Top fade */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 30,
          pointerEvents: "none",
          background: "linear-gradient(to bottom, black, transparent)",
          zIndex: 2,
          opacity: showTopFade ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
      {/* Scrollable chat */}
      <Box
        ref={chatRef}
        sx={{
          width: "100%",
          height: "100%",
          overflowY: "auto",
          color: "white",
          p: 1,
          direction: "rtl",
          scrollbarWidth: "none" as const,
          msOverflowStyle: "none" as const,
          "&::-webkit-scrollbar": { display: "none" },
          "& *::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {renderedMessages}
        </Box>
      </Box>
      {/* Empty state */}
      {renderedMessages.length === 0 && !isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary" align="center">
            چت شروع نشده...
          </Typography>
        </Box>
      )}
      {/* Bottom fade */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 30,
          pointerEvents: "none",
          background: "linear-gradient(to top, black, transparent)",
          zIndex: 2,
          opacity: showBottomFade ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
    </Box>
  );
});
