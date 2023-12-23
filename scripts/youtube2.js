const axios = require("axios");
const util = require("./util");
const fs = require("fs");

function convertISO8601ToTime(duration) {
  try {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;

    // 시간이 0이 아니면 시간 포함, 그렇지 않으면 분:초 형식으로 반환
    return hours > 0
      ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      : `${minutes}:${seconds.toString().padStart(2, "0")}`;
  } catch (error) {
    return "체크가 안됨";
  }
}

async function getChannelId(apiKey, channelName) {
  try {
    // 채널 검색
    const searchResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${channelName}&type=channel&key=${apiKey}`
    );
    const channels = searchResponse.data.items;

    if (channels.length === 0) {
      console.log("No channels found");
      return null;
    }

    // 첫 번째 검색 결과의 채널 ID 반환
    return channels[0].id.channelId;
  } catch (error) {
    console.error("Error searching for channel");
  }
}

async function getPlaylistItems(
  apiKey,
  playlistId,
  nextPageToken = "",
  allVideos = []
) {
  const maxResults = 50; // 한 번의 요청으로 가져올 최대 항목 수
  let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${apiKey}`;

  if (nextPageToken) {
    url += `&pageToken=${nextPageToken}`;
  }

  try {
    const response = await axios.get(url);
    const items = response.data.items;
    allVideos.push(...items);

    if (response.data.nextPageToken) {
      await getPlaylistItems(
        apiKey,
        playlistId,
        response.data.nextPageToken,
        allVideos
      );
    }

    return allVideos;
  } catch (error) {
    console.error("Error fetching playlist items");
  }
}

async function getVideoDetails(apiKey, videoIds) {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds.join(
        ","
      )}&key=${apiKey}`
    );
    return response.data.items.reduce((details, item) => {
      details[item.id] = {
        duration: item.contentDetails.duration,
        viewCount: item.statistics.viewCount, // 조회 수 추가
      };
      return details;
    }, {});
  } catch (error) {
    console.error("Error fetching video details");
  }
}

async function getSubscribersCount(apiKey, channelId) {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`
    );
    return response.data.items[0].statistics.subscriberCount;
  } catch (error) {
    console.error("Error fetching subscribers count");
  }
}

async function getVideoDetailsBatch(apiKey, videoIds) {
  const videoDetails = {};

  // 한 번에 처리할 수 있는 최대 동영상 ID 수
  const batchSize = 50;

  // videoIds 배열을 batchSize 크기의 청크로 분할
  for (let i = 0; i < videoIds.length; i += batchSize) {
    const batch = videoIds.slice(i, i + batchSize);
    const batchDetails = await getVideoDetails(apiKey, batch);

    // 결과를 videoDetails 객체에 병합
    Object.assign(videoDetails, batchDetails);
  }

  return videoDetails;
}

async function getYouTubeChannelData(apiKey, channelName) {
  try {
    const channelId = await getChannelId(apiKey, channelName);

    if (!channelId) {
      console.log("Channel not found");
      return;
    }

    const subscribersCount = await getSubscribersCount(apiKey, channelId);

    // 채널의 업로드된 동영상 목록을 가져옴
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
    );
    const playlistId =
      response.data.items[0].contentDetails.relatedPlaylists.uploads;

    const videoList = await getPlaylistItems(apiKey, playlistId);

    const videos = videoList.map((item) => {
      return {
        videoId: item.snippet.resourceId.videoId,
        title: item.snippet.title
          .replace(/,/g, "")
          .replace(/\n/g, " ")
          .replace(/\r/g, ""),
        uploadDate: item.snippet.publishedAt,
        thumbnail: item.snippet.thumbnails.high.url,
        description: item.snippet.description
          .replace(/\n/g, " ")
          .replace(/\r/g, "")
          .replace(/,/g, ""),
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        subscribersCount,
      };
    });

    const videoIds = videos.map((video) => video.videoId);

    const videoDetails = await getVideoDetailsBatch(apiKey, videoIds);

    const detailedVideos = videos.map((video) => {
      const details = videoDetails[video.videoId];
      return {
        ...video,
        duration: convertISO8601ToTime(details.duration),
        viewCount: details.viewCount,
      };
    });

    return detailedVideos;

    // return videos;
  } catch (error) {
    console.error("Error fetching YouTube data", error);
  }
}

// 사용 예시
const apiKey = ""; // 여기에 API 키를 입력하세요.

const channelNameList = [
  "나음힐링센터 방태환원장",
  "건강오름",
  "건강의학전문채널 하이닥",
];
channelNameList.forEach((channelName) => {
  getYouTubeChannelData(apiKey, channelName).then((videos) => {
    console.log(channelName, videos.length);
    const csv = util.jsonToCsv(videos);

    fs.writeFileSync(`./csv/${channelName}.csv`, "\uFEFF" + csv);
  });
});

// const channelName = "가루씨의 집밥Garussi home cooking";
// getYouTubeChannelData(apiKey, channelName).then((videos) => {
//   console.log(videos.slice(0, 20));
//   const csv = util.jsonToCsv(videos);

//   fs.writeFileSync(`./csv/${channelName}.csv`, "\uFEFF" + csv);
// });
