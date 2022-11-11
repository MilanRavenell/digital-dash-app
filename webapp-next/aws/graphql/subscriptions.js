/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onCreateUser(filter: $filter, owner: $owner) {
      owner
      email
      firstName
      lastName
      hasAccess
      canEmail
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onUpdateUser(filter: $filter, owner: $owner) {
      owner
      email
      firstName
      lastName
      hasAccess
      canEmail
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onDeleteUser(filter: $filter, owner: $owner) {
      owner
      email
      firstName
      lastName
      hasAccess
      canEmail
      createdAt
      updatedAt
    }
  }
`;
export const onCreateUserProfile = /* GraphQL */ `
  subscription OnCreateUserProfile(
    $filter: ModelSubscriptionUserProfileFilterInput
    $owner: String
  ) {
    onCreateUserProfile(filter: $filter, owner: $owner) {
      owner
      key
      profile {
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
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateUserProfile = /* GraphQL */ `
  subscription OnUpdateUserProfile(
    $filter: ModelSubscriptionUserProfileFilterInput
    $owner: String
  ) {
    onUpdateUserProfile(filter: $filter, owner: $owner) {
      owner
      key
      profile {
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
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteUserProfile = /* GraphQL */ `
  subscription OnDeleteUserProfile(
    $filter: ModelSubscriptionUserProfileFilterInput
    $owner: String
  ) {
    onDeleteUserProfile(filter: $filter, owner: $owner) {
      owner
      key
      profile {
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
      createdAt
      updatedAt
    }
  }
`;
export const onCreateProfile = /* GraphQL */ `
  subscription OnCreateProfile($filter: ModelSubscriptionProfileFilterInput) {
    onCreateProfile(filter: $filter) {
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
export const onUpdateProfile = /* GraphQL */ `
  subscription OnUpdateProfile($filter: ModelSubscriptionProfileFilterInput) {
    onUpdateProfile(filter: $filter) {
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
export const onCreateConfiguration = /* GraphQL */ `
  subscription OnCreateConfiguration(
    $filter: ModelSubscriptionConfigurationFilterInput
  ) {
    onCreateConfiguration(filter: $filter) {
      key
      value
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateConfiguration = /* GraphQL */ `
  subscription OnUpdateConfiguration(
    $filter: ModelSubscriptionConfigurationFilterInput
  ) {
    onUpdateConfiguration(filter: $filter) {
      key
      value
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteConfiguration = /* GraphQL */ `
  subscription OnDeleteConfiguration(
    $filter: ModelSubscriptionConfigurationFilterInput
  ) {
    onDeleteConfiguration(filter: $filter) {
      key
      value
      createdAt
      updatedAt
    }
  }
`;
