/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
      email
      firstName
      lastName
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
      email
      firstName
      lastName
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
      email
      firstName
      lastName
      createdAt
      updatedAt
    }
  }
`;
export const onCreateUserProfile = /* GraphQL */ `
  subscription OnCreateUserProfile(
    $filter: ModelSubscriptionUserProfileFilterInput
  ) {
    onCreateUserProfile(filter: $filter) {
      user
      platform
      profileName
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateUserProfile = /* GraphQL */ `
  subscription OnUpdateUserProfile(
    $filter: ModelSubscriptionUserProfileFilterInput
  ) {
    onUpdateUserProfile(filter: $filter) {
      user
      platform
      profileName
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteUserProfile = /* GraphQL */ `
  subscription OnDeleteUserProfile(
    $filter: ModelSubscriptionUserProfileFilterInput
  ) {
    onDeleteUserProfile(filter: $filter) {
      user
      platform
      profileName
      createdAt
      updatedAt
    }
  }
`;
export const onCreateTwitterPost = /* GraphQL */ `
  subscription OnCreateTwitterPost(
    $filter: ModelSubscriptionTwitterPostFilterInput
  ) {
    onCreateTwitterPost(filter: $filter) {
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
export const onUpdateTwitterPost = /* GraphQL */ `
  subscription OnUpdateTwitterPost(
    $filter: ModelSubscriptionTwitterPostFilterInput
  ) {
    onUpdateTwitterPost(filter: $filter) {
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
export const onDeleteTwitterPost = /* GraphQL */ `
  subscription OnDeleteTwitterPost(
    $filter: ModelSubscriptionTwitterPostFilterInput
  ) {
    onDeleteTwitterPost(filter: $filter) {
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
export const onCreateYoutubePost = /* GraphQL */ `
  subscription OnCreateYoutubePost(
    $filter: ModelSubscriptionYoutubePostFilterInput
  ) {
    onCreateYoutubePost(filter: $filter) {
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
export const onUpdateYoutubePost = /* GraphQL */ `
  subscription OnUpdateYoutubePost(
    $filter: ModelSubscriptionYoutubePostFilterInput
  ) {
    onUpdateYoutubePost(filter: $filter) {
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
export const onDeleteYoutubePost = /* GraphQL */ `
  subscription OnDeleteYoutubePost(
    $filter: ModelSubscriptionYoutubePostFilterInput
  ) {
    onDeleteYoutubePost(filter: $filter) {
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
