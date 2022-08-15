/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getData = /* GraphQL */ `
  query GetData($input: GetDataInput!) {
    getData(input: $input) {
      success
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
  query GetUserProfile($user: String!, $platform: String!) {
    getUserProfile(user: $user, platform: $platform) {
      user
      platform
      profileName
      createdAt
      updatedAt
    }
  }
`;
export const listUserProfiles = /* GraphQL */ `
  query ListUserProfiles(
    $user: String
    $platform: ModelStringKeyConditionInput
    $filter: ModelUserProfileFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUserProfiles(
      user: $user
      platform: $platform
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        user
        platform
        profileName
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTwitterPost = /* GraphQL */ `
  query GetTwitterPost($id: String!, $createdAt: String!) {
    getTwitterPost(id: $id, createdAt: $createdAt) {
      id
      createdAt
      profileName
      datePosted
      caption
      viewCount
      engagementCount
      profileClickCount
      likeCount
      detailExpandCount
      mediaEngagementCount
      replyCount
      updatedAt
    }
  }
`;
export const listTwitterPosts = /* GraphQL */ `
  query ListTwitterPosts(
    $id: String
    $createdAt: ModelStringKeyConditionInput
    $filter: ModelTwitterPostFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listTwitterPosts(
      id: $id
      createdAt: $createdAt
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
        viewCount
        engagementCount
        profileClickCount
        likeCount
        detailExpandCount
        mediaEngagementCount
        replyCount
        updatedAt
      }
      nextToken
    }
  }
`;
export const getYoutubePost = /* GraphQL */ `
  query GetYoutubePost($id: String!, $createdAt: String!) {
    getYoutubePost(id: $id, createdAt: $createdAt) {
      id
      createdAt
      profileName
      datePosted
      caption
      viewCount
      engagementCount
      likeCount
      commentCount
      updatedAt
    }
  }
`;
export const listYoutubePosts = /* GraphQL */ `
  query ListYoutubePosts(
    $id: String
    $createdAt: ModelStringKeyConditionInput
    $filter: ModelYoutubePostFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listYoutubePosts(
      id: $id
      createdAt: $createdAt
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
        viewCount
        engagementCount
        likeCount
        commentCount
        updatedAt
      }
      nextToken
    }
  }
`;
export const twitterPostsByProfileName = /* GraphQL */ `
  query TwitterPostsByProfileName(
    $profileName: String!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTwitterPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    twitterPostsByProfileName(
      profileName: $profileName
      createdAt: $createdAt
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
        viewCount
        engagementCount
        profileClickCount
        likeCount
        detailExpandCount
        mediaEngagementCount
        replyCount
        updatedAt
      }
      nextToken
    }
  }
`;
export const youtubePostsByProfileName = /* GraphQL */ `
  query YoutubePostsByProfileName(
    $profileName: String!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelYoutubePostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    youtubePostsByProfileName(
      profileName: $profileName
      createdAt: $createdAt
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
        viewCount
        engagementCount
        likeCount
        commentCount
        updatedAt
      }
      nextToken
    }
  }
`;
