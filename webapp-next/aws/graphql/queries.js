/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getData = /* GraphQL */ `
  query GetData($input: GetDataInput!) {
    getData(input: $input) {
      success
    }
  }
`;
export const findProfiles = /* GraphQL */ `
  query FindProfiles($input: FindProfilesInput!) {
    findProfiles(input: $input) {
      success
      profiles {
        profileName
        meta
      }
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($email: String!) {
    getUser(email: $email) {
      email
      firstName
      lastName
      createdAt
      updatedAt
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $email: String
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUsers(
      email: $email
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        email
        firstName
        lastName
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getUserProfile = /* GraphQL */ `
  query GetUserProfile($user: String!, $key: String!) {
    getUserProfile(user: $user, key: $key) {
      user
      key
      platform
      profileName
      meta
      profilePicUrl
      followerCount
      needsRefresh
      postsLastPopulated
      createdAt
      updatedAt
    }
  }
`;
export const listUserProfiles = /* GraphQL */ `
  query ListUserProfiles(
    $user: String
    $key: ModelStringKeyConditionInput
    $filter: ModelUserProfileFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUserProfiles(
      user: $user
      key: $key
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        user
        key
        platform
        profileName
        meta
        profilePicUrl
        followerCount
        needsRefresh
        postsLastPopulated
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTwitterPost = /* GraphQL */ `
  query GetTwitterPost($id: String!) {
    getTwitterPost(id: $id) {
      id
      createdAt
      profileName
      datePosted
      caption
      link
      media {
        thumbnailUrl
        type
      }
      viewCount
      engagementCount
      engagementRate
      profileClickCount
      likeCount
      detailExpandCount
      mediaEngagementCount
      replyCount
      retweetCount
      updatedAt
    }
  }
`;
export const listTwitterPosts = /* GraphQL */ `
  query ListTwitterPosts(
    $id: String
    $filter: ModelTwitterPostFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listTwitterPosts(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        createdAt
        profileName
        datePosted
        caption
        link
        viewCount
        engagementCount
        engagementRate
        profileClickCount
        likeCount
        detailExpandCount
        mediaEngagementCount
        replyCount
        retweetCount
        updatedAt
      }
      nextToken
    }
  }
`;
export const getYoutubePost = /* GraphQL */ `
  query GetYoutubePost($id: String!) {
    getYoutubePost(id: $id) {
      id
      createdAt
      profileName
      datePosted
      caption
      link
      media {
        thumbnailUrl
        type
      }
      viewCount
      engagementCount
      engagementRate
      likeCount
      commentCount
      dislikeCount
      favoriteCount
      updatedAt
    }
  }
`;
export const listYoutubePosts = /* GraphQL */ `
  query ListYoutubePosts(
    $id: String
    $filter: ModelYoutubePostFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listYoutubePosts(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        createdAt
        profileName
        datePosted
        caption
        link
        viewCount
        engagementCount
        engagementRate
        likeCount
        commentCount
        dislikeCount
        favoriteCount
        updatedAt
      }
      nextToken
    }
  }
`;
export const getInstagramPost = /* GraphQL */ `
  query GetInstagramPost($id: String!) {
    getInstagramPost(id: $id) {
      id
      createdAt
      profileName
      datePosted
      caption
      link
      media {
        thumbnailUrl
        type
      }
      viewCount
      engagementCount
      engagementRate
      likeCount
      commentCount
      saveCount
      reachCount
      updatedAt
    }
  }
`;
export const listInstagramPosts = /* GraphQL */ `
  query ListInstagramPosts(
    $id: String
    $filter: ModelInstagramPostFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listInstagramPosts(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        createdAt
        profileName
        datePosted
        caption
        link
        viewCount
        engagementCount
        engagementRate
        likeCount
        commentCount
        saveCount
        reachCount
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTiktokPost = /* GraphQL */ `
  query GetTiktokPost($id: String!) {
    getTiktokPost(id: $id) {
      id
      createdAt
      profileName
      datePosted
      caption
      link
      media {
        thumbnailUrl
        type
      }
      viewCount
      engagementCount
      engagementRate
      likeCount
      commentCount
      shareCount
      updatedAt
    }
  }
`;
export const listTiktokPosts = /* GraphQL */ `
  query ListTiktokPosts(
    $id: String
    $filter: ModelTiktokPostFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listTiktokPosts(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        createdAt
        profileName
        datePosted
        caption
        link
        viewCount
        engagementCount
        engagementRate
        likeCount
        commentCount
        shareCount
        updatedAt
      }
      nextToken
    }
  }
`;
export const getMetricHistory = /* GraphQL */ `
  query GetMetricHistory($key: String!, $createdAt: String!) {
    getMetricHistory(key: $key, createdAt: $createdAt) {
      key
      profileKey
      metric
      createdAt
      value
      updatedAt
    }
  }
`;
export const listMetricHistories = /* GraphQL */ `
  query ListMetricHistories(
    $key: String
    $createdAt: ModelStringKeyConditionInput
    $filter: ModelMetricHistoryFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listMetricHistories(
      key: $key
      createdAt: $createdAt
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        key
        profileKey
        metric
        createdAt
        value
        updatedAt
      }
      nextToken
    }
  }
`;
export const userProfilesByUserAndPlatform = /* GraphQL */ `
  query UserProfilesByUserAndPlatform(
    $user: String!
    $platform: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelUserProfileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userProfilesByUserAndPlatform(
      user: $user
      platform: $platform
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        user
        key
        platform
        profileName
        meta
        profilePicUrl
        followerCount
        needsRefresh
        postsLastPopulated
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const twitterPostsByProfileName = /* GraphQL */ `
  query TwitterPostsByProfileName(
    $profileName: String!
    $datePosted: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTwitterPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    twitterPostsByProfileName(
      profileName: $profileName
      datePosted: $datePosted
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        createdAt
        profileName
        datePosted
        caption
        link
        viewCount
        engagementCount
        engagementRate
        profileClickCount
        likeCount
        detailExpandCount
        mediaEngagementCount
        replyCount
        retweetCount
        updatedAt
      }
      nextToken
    }
  }
`;
export const youtubePostsByProfileName = /* GraphQL */ `
  query YoutubePostsByProfileName(
    $profileName: String!
    $datePosted: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelYoutubePostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    youtubePostsByProfileName(
      profileName: $profileName
      datePosted: $datePosted
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        createdAt
        profileName
        datePosted
        caption
        link
        viewCount
        engagementCount
        engagementRate
        likeCount
        commentCount
        dislikeCount
        favoriteCount
        updatedAt
      }
      nextToken
    }
  }
`;
export const igPostsByProfileName = /* GraphQL */ `
  query IgPostsByProfileName(
    $profileName: String!
    $datePosted: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelInstagramPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    igPostsByProfileName(
      profileName: $profileName
      datePosted: $datePosted
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        createdAt
        profileName
        datePosted
        caption
        link
        viewCount
        engagementCount
        engagementRate
        likeCount
        commentCount
        saveCount
        reachCount
        updatedAt
      }
      nextToken
    }
  }
`;
export const tiktokPostsByProfileName = /* GraphQL */ `
  query TiktokPostsByProfileName(
    $profileName: String!
    $datePosted: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTiktokPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    tiktokPostsByProfileName(
      profileName: $profileName
      datePosted: $datePosted
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        createdAt
        profileName
        datePosted
        caption
        link
        viewCount
        engagementCount
        engagementRate
        likeCount
        commentCount
        shareCount
        updatedAt
      }
      nextToken
    }
  }
`;
