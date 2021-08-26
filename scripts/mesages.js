import * as utilsHelpers from "../utils/helpers.mjs";
import * as utilsConstants from "../utils/constants.mjs";

/**
 * Function as event handler to navigate back to chats page when the back button is clicked
 */
const goBackToChatsHandler = () => {
  window.location.href = "chats.html";
};

/**
 * Function to fetch messages from the local JSON file
 * @param {Function} callback - callback function to be invoked after successful reading of JSON file
 */
const fetchMessages = (callback) => {
  utilsHelpers.readJsonFile("../data/messages.json", (jsonString) => {
    const messages = JSON.parse(jsonString);
    callback(messages);
  });
};

/**
 * Function to display messages on DOM
 * @param {Object} messages - JSON-parsed object
 * Chat Message Template (Sent):
    <div class="chat-message sent">
      <div class="user-message">
        <div class="user-message__message sent">
          <p>
            I am fine. Thanks for asking.
          </p>
        </div>
      </div>
      <div class="user-message__message-time">01:09</div>
    </div>
 * Chat Message Template (Received):
    <div class="chat-message received">
      <div class="user-message">
        <div class="user-message__message received">
          <p>
            I am fine. Thanks for asking.
          </p>
        </div>
      </div>
      <div class="user-message__message-time">01:09</div>
    </div>
 */
const displayMessages = (messages) => {
  const rootMessagesListContainerElement =
    document.getElementById("messages-list");

  messages.messages.forEach((message) => {
    let isMessageSentBySelf = false;
    if (message.senderId === utilsConstants.SELF_USER_ID) {
      isMessageSentBySelf = true;
    }

    /* chat-message starts */
    const chatMessageContainerElement = document.createElement("div");
    chatMessageContainerElement.classList.add("chat-message");

    /* user-message starts */
    const userMessageContainerElement = document.createElement("div");
    userMessageContainerElement.classList.add("user-message");

    const userMessageElement = document.createElement("div");
    userMessageElement.classList.add("user-message__message");

    const userMessageParagraphElement = document.createElement("p");
    userMessageParagraphElement.innerText = message.message;

    userMessageElement.appendChild(userMessageParagraphElement);

    /* message-time starts */
    const messageTimeElement = document.createElement("div");
    messageTimeElement.classList.add("user-message__message-time");
    messageTimeElement.innerText = utilsHelpers.getLocalTimeZoneFormattedTime(
      message.timestamp
    );
    /* message-time ends */

    if (isMessageSentBySelf) {
      chatMessageContainerElement.classList.add("sent");
      userMessageElement.classList.add("sent");
    } else {
      chatMessageContainerElement.classList.add("received");

      /* user-image starts (user image is shown only when message is received) */
      const userImageContainerElement = document.createElement("div");
      userImageContainerElement.classList.add("user-message__user-image");
      const userImageElement = document.createElement("img");

      userImageContainerElement.appendChild(userImageElement);
      /* user-image ends */

      userMessageContainerElement.appendChild(userImageContainerElement);

      userImageElement.setAttribute(
        "src",
        "https://randomuser.me/api/portraits/men/77.jpg"
      );

      userMessageElement.classList.add("received");
    }

    userMessageContainerElement.appendChild(userMessageElement);
    /* user-message ends */

    chatMessageContainerElement.appendChild(userMessageContainerElement);
    chatMessageContainerElement.appendChild(messageTimeElement);
    /* chat-message ends */

    rootMessagesListContainerElement.appendChild(chatMessageContainerElement);
  });
};

window.onload = () => {
  fetchMessages((messages) => {
    displayMessages(messages);
  });

  document
    .getElementById("back-btn")
    .addEventListener("click", goBackToChatsHandler);
};
