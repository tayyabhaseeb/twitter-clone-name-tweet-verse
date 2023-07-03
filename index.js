import { tweetsData } from "/data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

const feedContainer = document.getElementById("feed");

document.addEventListener("click", function (event) {
  if (event.target.dataset.likes) {
    incrementLikes(event.target.dataset.likes);
  } else if (event.target.dataset.retweets) {
    incrementTweets(event.target.dataset.retweets);
  } else if (event.target.dataset.replies) {
    displayComments(event.target.dataset.replies);
  } else if (event.target.id === "tweet-btn") {
    displayInteractComment();
  }
});

function incrementLikes(likeID) {
  const likeObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === likeID;
  })[0];

  if (!likeObj.isLiked) {
    likeObj.likes++;
  } else {
    likeObj.likes--;
  }
  likeObj.isLiked = !likeObj.isLiked;
  render();
}

function incrementTweets(tweetID) {
  const tweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetID;
  })[0];

  if (!tweetObj.isRetweeted) {
    tweetObj.retweets++;
  } else {
    tweetObj.retweets--;
  }
  tweetObj.isRetweeted = !tweetObj.isRetweeted;
  render();
}

function displayComments(commentID) {
  document.getElementById(`replies-${commentID}`).classList.toggle("hidden");
}

function displayInteractComment() {
  const input = document.getElementById("tweet-input");
  tweetsData.unshift({
    handle: `@TayyabHaseeb`,
    profilePic: `images/Tayyab.jpg`,
    likes: 0,
    retweets: 0,
    tweetText: `${input.value}`,
    replies: [],
    isLiked: false,
    isRetweeted: false,
    uuid: uuidv4(),
  });
  render();
}

function tweetsRenderTemplate() {
  let templateHTML = "";
  tweetsData.forEach(function (tweet) {
    let likeIconClass = "";
    let retweetIconClass = "";

    if (tweet.isLiked) {
      likeIconClass = "liked";
    }
    if (tweet.isRetweeted) {
      retweetIconClass = "retweeted";
    }

    let commentHTML = "";

    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        commentHTML += `
<div class="tweet-reply">
<div class="tweet-inner">
    <img src="${reply.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${reply.handle}</p>
            <p class="tweet-text">${reply.tweetText}</p>
        </div>
    </div>
</div>
`;
      });
    }

    templateHTML += `

    <div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                <i class="fa-regular fa-comment-dots" data-replies = '${tweet.uuid}' ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                <i class="fa-solid fa-heart ${likeIconClass}" data-likes = '${tweet.uuid}'></i>
                    ${tweet.likes}
                    
                </span>
                <span class="tweet-detail">
                <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweets = '${tweet.uuid}'></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
     ${commentHTML}
    
    </div>
</div>

    


    `;
  });
  return templateHTML;
}

function render() {
  feedContainer.innerHTML = tweetsRenderTemplate();
}

render();
