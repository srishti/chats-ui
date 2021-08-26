import * as utilsHelpers from "../utils/helpers.mjs";
import * as utilsConstants from "../utils/constants.mjs";

let MESSAGES = []; // message results on search
let FILTERED_MESSAGES = []; // message results on search
let USERS = {}; // all users

/**
 * Function as event handler to navigate to messages page when a chat item is clicked
 * @param {String} userId
 */
const navigateToMessagesHandler = (userId) => {
  window.location.href = `messages.html`;
};

/**
 * Function to fetch chats from the local JSON file
 * @param {Function} callback - callback function to be invoked after successful reading of JSON file
 */
const fetchChats = (callback) => {
  utilsHelpers.readJsonFile("../data/chats.json", (jsonString) => {
    const chats = JSON.parse(jsonString);
    callback(chats);
  });
};

/**
 * Function to fetch messages from the local JSON file
 * @param {Function} callback - callback function to be invoked after successful reading of JSON file
 */
const fetchMessages = () => {
  utilsHelpers.readJsonFile("../data/messages.json", (jsonString) => {
    const messages = JSON.parse(jsonString);
    MESSAGES = messages.messages;
  });
};

/**
 * Function to fetch users from the local JSON file
 * @param {Function} callback - callback function to be invoked after successful reading of JSON file
 */
const fetchUsers = () => {
  utilsHelpers.readJsonFile("../data/users.json", (jsonString) => {
    const users = JSON.parse(jsonString);
    USERS = users;
  });
};

/**
 * Function to display favourite users on DOM
 * @param {Object} chats - JSON-parsed object
 * Favourite User Item Template:
    <li class="favourite-user">
      <div class="user-image">
        <img src="https://randomuser.me/api/portraits/women/2.jpg" />
      </div>
      <div class="favourite-user__name">Srishti</div>
	  </li>
 */
const displayFavouriteUsers = (chats) => {
  const rootFavouriteUsersListContainerElement =
    document.getElementById("favourite-users");

  chats.chats.forEach((chat) => {
    if (chat.isFavourite) {
      /* favourite-user starts */
      const favouriteUserItemElement = document.createElement("li");
      favouriteUserItemElement.classList.add("favourite-user");
      favouriteUserItemElement.addEventListener(
        "click",
        navigateToMessagesHandler
      );

      /* user-image starts */
      const userImageContainerElement = document.createElement("div");
      userImageContainerElement.classList.add("user-image");
      const userImageElement = document.createElement("img");
      userImageElement.setAttribute("src", chat.userProfilePicture);

      userImageContainerElement.appendChild(userImageElement);
      /* user-image ends */

      /* user name starts */
      const userNameElement = document.createElement("div");
      userNameElement.classList.add("favourite-user__name");
      userNameElement.innerText = chat.firstName;
      /* user name ends */

      favouriteUserItemElement.appendChild(userImageContainerElement);
      favouriteUserItemElement.appendChild(userNameElement);
      /* favourite-user ends */

      rootFavouriteUsersListContainerElement.appendChild(
        favouriteUserItemElement
      );
    }
  });
};

/**
 * Function to display chats on DOM
 * @param {Object} chats - JSON-parsed object
 * Chat Item Template:
  <li class="chat-item">
		<div class="user-image">
			<img src="https://randomuser.me/api/portraits/women/2.jpg" />
		</div>
		<div class="chat-details">
			<div class="message-details">
				<h3 class="user-name">Srishti</h3>
				<p class="recent-chat-message">How are you?</p>
			</div>
			<div class="message-statistics unread">
				<h4 class="recent-message-time">just now</h4>
				<div class="unread-message-count">5</div>
			</div>
		</div>
	</li>
 */
const displayChats = (chats) => {
  const rootChatsListContainerElement = document.getElementById("chats-list");
  rootChatsListContainerElement.innerHTML = "";

  chats.chats.forEach((chat) => {
    /* chat-item starts */
    const chatItemContainerElement = document.createElement("div");
    chatItemContainerElement.classList.add("chat-item");

    /* user-image starts */
    const userImageContainerElement = document.createElement("div");
    userImageContainerElement.classList.add("user-image");

    const userImageElement = document.createElement("img");
    userImageElement.setAttribute("src", chat.userProfilePicture);

    userImageContainerElement.appendChild(userImageElement);
    chatItemContainerElement.appendChild(userImageContainerElement);
    /* user-image ends */

    /* chat-details start */
    const chatDetailsContainerElement = document.createElement("div");
    chatDetailsContainerElement.classList.add("chat-details");

    /* message-details start */
    const messageDetailsContainerElement = document.createElement("div");
    messageDetailsContainerElement.classList.add("message-details");

    const userNameElement = document.createElement("h3");
    userNameElement.classList.add("user-name");
    userNameElement.innerText = chat.firstName;

    const recentChatMessageElement = document.createElement("p");
    recentChatMessageElement.classList.add("recent-chat-message");
    recentChatMessageElement.innerText = chat.recentMessage.message;

    messageDetailsContainerElement.appendChild(userNameElement);
    messageDetailsContainerElement.appendChild(recentChatMessageElement);
    /* message-details end */

    /* message-statistics start */
    const messageStatisticsContainerElement = document.createElement("div");
    messageStatisticsContainerElement.classList.add("message-statistics");

    if (chat.unread > 0) {
      messageStatisticsContainerElement.classList.add("unread");
    }

    const recentMessageTimeElement = document.createElement("h4");
    recentMessageTimeElement.classList.add("recent-message-time");
    recentMessageTimeElement.innerText =
      utilsHelpers.getLocalTimeZoneFormattedTime(chat.recentMessage.timestamp);

    const unreadMessageCountElement = document.createElement("div");
    unreadMessageCountElement.classList.add("unread-message-count");
    unreadMessageCountElement.innerText = chat.unread;

    messageStatisticsContainerElement.appendChild(recentMessageTimeElement);
    messageStatisticsContainerElement.appendChild(unreadMessageCountElement);
    /* message-statistics end */

    chatDetailsContainerElement.appendChild(messageDetailsContainerElement);
    chatDetailsContainerElement.appendChild(messageStatisticsContainerElement);
    /* chat-details end */

    chatItemContainerElement.appendChild(chatDetailsContainerElement);
    chatItemContainerElement.addEventListener(
      "click",
      navigateToMessagesHandler.bind(this, chat.userId)
    );
    /* chat-item ends */

    rootChatsListContainerElement.appendChild(chatItemContainerElement);
  });
};

/**
 * Function to display search results on DOM
 * Search Result Template:
    <li class="search-item">
      <div class="search-item__details">
        <div class="message-details">
          <h3 class="user-name">Srishti</h3>
          <p class="search-chat-message">How are you?</p>
        </div>
      </div>
	  </li>
 */
const displaySearchResults = () => {
  const rootChatsListContainerElement = document.getElementById("chats-list");
  rootChatsListContainerElement.innerHTML = "";

  FILTERED_MESSAGES.forEach((message) => {
    /* chat-item starts */
    const chatItemContainerElement = document.createElement("li");
    chatItemContainerElement.classList.add("search-item");

    /* chat-details start */
    const chatDetailsContainerElement = document.createElement("div");
    chatDetailsContainerElement.classList.add("search-item__details");

    /* message-details start */
    const messageDetailsContainerElement = document.createElement("div");
    messageDetailsContainerElement.classList.add("message-details");

    const userNameElement = document.createElement("h3");
    userNameElement.classList.add("user-name");
    // show name of the user with whom the current user has had the chat conversation
    if (utilsConstants.SELF_USER_ID == message.senderId) {
      userNameElement.innerText = USERS[message.receiverId].firstName;
    } else {
      userNameElement.innerText = USERS[message.senderId].firstName;
    }

    const recentChatMessageElement = document.createElement("p");
    recentChatMessageElement.classList.add("search-chat-message");
    recentChatMessageElement.innerText = message.message;

    messageDetailsContainerElement.appendChild(userNameElement);
    messageDetailsContainerElement.appendChild(recentChatMessageElement);
    /* message-details end */

    chatDetailsContainerElement.appendChild(messageDetailsContainerElement);
    /* chat-details end */

    chatItemContainerElement.appendChild(chatDetailsContainerElement);
    chatItemContainerElement.addEventListener(
      "click",
      navigateToMessagesHandler.bind(this, message.userId)
    );
    /* chat-item ends */

    rootChatsListContainerElement.appendChild(chatItemContainerElement);
  });
};

/**
 * Function to search chat
 */
const searchMessages = (searchText) => {
  if (searchText) {
    FILTERED_MESSAGES = MESSAGES.filter((message) => {
      if (message.message.toLowerCase().includes(searchText.toLowerCase())) {
        console.log(message);
        return message;
      }
    });
  } else {
    FILTERED_MESSAGES = MESSAGES;
  }
  displaySearchResults();
};

let timer;
/**
 * Function as event handler fired when some text is typed inside the search box
 */
const searchHandler = () => {
  // DEBOUNCING - search for text only after 500ms expire instead of searching on every key stroke
  if (timer) {
    clearTimeout(timer);
  }

  const searchInputElement = document.getElementById("search");
  const searchText = searchInputElement.value;
  timer = setTimeout(() => {
    searchMessages(searchText);
  }, 500);
};

window.onload = () => {
  fetchChats((chats) => {
    displayChats(chats);
    displayFavouriteUsers(chats);
    document.getElementById("search").addEventListener("focusout", () => {
      displayChats(chats);
    });
  });
  fetchMessages();
  fetchUsers();

  document.getElementById("search").addEventListener("keyup", searchHandler);
};
