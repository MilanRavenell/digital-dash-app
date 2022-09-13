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
export const getBeefedUserProfiles = /* GraphQL */ `
  query GetBeefedUserProfiles($input: GetBeefedUserProfilesInput!) {
    getBeefedUserProfiles(input: $input) {
      profiles {
        user
        platform
        profileName
        profilePicUrl
        followerCount
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
      postsLastPopulated
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
        postsLastPopulated
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getUserProfile = /* GraphQL */ `
  query GetUserProfile($user: String!, $profileName: String!) {
    getUserProfile(user: $user, profileName: $profileName) {
      user
      platform
      profileName
      meta
      createdAt
      updatedAt
    }
  }
`;
export const listUserProfiles = /* GraphQL */ `
  query ListUserProfiles(
    $user: String
    $profileName: ModelStringKeyConditionInput
    $filter: ModelUserProfileFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUserProfiles(
      user: $user
      profileName: $profileName
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        user
        platform
        profileName
        meta
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
        platform
        profileName
        meta
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
