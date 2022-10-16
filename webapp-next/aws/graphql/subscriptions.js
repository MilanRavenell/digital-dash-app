/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($owner: String) {
    onCreateUser(owner: $owner) {
      owner
      email
      firstName
      lastName
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($owner: String) {
    onUpdateUser(owner: $owner) {
      owner
      email
      firstName
      lastName
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($owner: String) {
    onDeleteUser(owner: $owner) {
      owner
      email
      firstName
      lastName
      createdAt
      updatedAt
    }
  }
`;
export const onCreateUserProfile = /* GraphQL */ `
  subscription OnCreateUserProfile($owner: String) {
    onCreateUserProfile(owner: $owner) {
      user
      owner
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
export const onUpdateUserProfile = /* GraphQL */ `
  subscription OnUpdateUserProfile($owner: String) {
    onUpdateUserProfile(owner: $owner) {
      user
      owner
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
export const onDeleteUserProfile = /* GraphQL */ `
  subscription OnDeleteUserProfile($owner: String) {
    onDeleteUserProfile(owner: $owner) {
      user
      owner
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
export const onCreateInstagramPost = /* GraphQL */ `
  subscription OnCreateInstagramPost(
    $filter: ModelSubscriptionInstagramPostFilterInput
  ) {
    onCreateInstagramPost(filter: $filter) {
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
export const onUpdateInstagramPost = /* GraphQL */ `
  subscription OnUpdateInstagramPost(
    $filter: ModelSubscriptionInstagramPostFilterInput
  ) {
    onUpdateInstagramPost(filter: $filter) {
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
export const onDeleteInstagramPost = /* GraphQL */ `
  subscription OnDeleteInstagramPost(
    $filter: ModelSubscriptionInstagramPostFilterInput
  ) {
    onDeleteInstagramPost(filter: $filter) {
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
export const onCreateTiktokPost = /* GraphQL */ `
  subscription OnCreateTiktokPost(
    $filter: ModelSubscriptionTiktokPostFilterInput
  ) {
    onCreateTiktokPost(filter: $filter) {
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
export const onUpdateTiktokPost = /* GraphQL */ `
  subscription OnUpdateTiktokPost(
    $filter: ModelSubscriptionTiktokPostFilterInput
  ) {
    onUpdateTiktokPost(filter: $filter) {
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
export const onDeleteTiktokPost = /* GraphQL */ `
  subscription OnDeleteTiktokPost(
    $filter: ModelSubscriptionTiktokPostFilterInput
  ) {
    onDeleteTiktokPost(filter: $filter) {
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
export const onCreateMetricHistory = /* GraphQL */ `
  subscription OnCreateMetricHistory(
    $filter: ModelSubscriptionMetricHistoryFilterInput
  ) {
    onCreateMetricHistory(filter: $filter) {
      key
      profileKey
      metric
      createdAt
      value
      updatedAt
    }
  }
`;
export const onUpdateMetricHistory = /* GraphQL */ `
  subscription OnUpdateMetricHistory(
    $filter: ModelSubscriptionMetricHistoryFilterInput
  ) {
    onUpdateMetricHistory(filter: $filter) {
      key
      profileKey
      metric
      createdAt
      value
      updatedAt
    }
  }
`;
export const onDeleteMetricHistory = /* GraphQL */ `
  subscription OnDeleteMetricHistory(
    $filter: ModelSubscriptionMetricHistoryFilterInput
  ) {
    onDeleteMetricHistory(filter: $filter) {
      key
      profileKey
      metric
      createdAt
      value
      updatedAt
    }
  }
`;
