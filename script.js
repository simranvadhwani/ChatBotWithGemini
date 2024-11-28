const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const chatBody = document.querySelector(".chat-body");

// Replace with your Chatbot API URL and Key
const CHATBOT_API_URL = "https://api.openai.com/v1/chat/completions";
const API_KEY =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAKRP8vptEGra3wQfARaIFiL6c2O8PNMb0";

// Send button functionality
sendBtn.addEventListener("click", handleSendMessage);

// Handle Enter key press for sending message
chatInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleSendMessage();
  }
});

async function handleSendMessage() {
  const userMessage = chatInput.value.trim();

  if (userMessage) {
    // Display user message
    addMessage(userMessage, "user-message");

    // Display "Thinking..." message
    const thinkingMessage = addMessage("Thinking...", "bot-message");

    // Scroll to the bottom
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
      // Get bot response
      const botResponse = await getBotResponse(userMessage);

      // Replace "Thinking..." with the actual response
      thinkingMessage.textContent = botResponse;
    } catch (error) {
      // Replace "Thinking..." with an error message
      thinkingMessage.textContent =
        "Error connecting to chatbot. Please try again later.";
    }

    // Clear input and scroll to bottom
    chatInput.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;
  }
}

// Updated `addMessage` function to return the created message element
function addMessage(message, className) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", className);
  messageDiv.textContent = message;
  chatBody.appendChild(messageDiv);
  return messageDiv; // Return the created message element
}

// Function to get chatbot response from API
async function getBotResponse(userMessage) {
  try {
    let RequestOption = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: userMessage }, // Dynamic userMessage passed here
            ],
          },
        ],
      }),
    };
    let response = await fetch(API_KEY, RequestOption);
    let data = await response.json();
    let apiResponse = data.candidates[0].content.parts[0].text
      .replace(/\*\*(.?)\*\*/g, "$1")
      .trim();
    return apiResponse;
  } catch (error) {
    console.error("Error contacting chatbot API:", error);
    return "Error connecting to chatbot. Please try again later.";
  }
}
