/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const populateAnalytics = /* GraphQL */ `
  mutation PopulateAnalytics($input: PopulateAnalyticsInput!) {
    populateAnalytics(input: $input) {
      dataUpdated
      success
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      email
      firstName
      lastName
      createdAt
      updatedAt
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      email
      firstName
      lastName
      createdAt
      updatedAt
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      email
      firstName
      lastName
      createdAt
      updatedAt
    }
  }
`;
export const createUserProfile = /* GraphQL */ `
  mutation CreateUserProfile(
    $input: CreateUserProfileInput!
    $condition: ModelUserProfileConditionInput
  ) {
    createUserProfile(input: $input, condition: $condition) {
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
export const updateUserProfile = /* GraphQL */ `
  mutation UpdateUserProfile(
    $input: UpdateUserProfileInput!
    $condition: ModelUserProfileConditionInput
  ) {
    updateUserProfile(input: $input, condition: $condition) {
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
export const deleteUserProfile = /* GraphQL */ `
  mutation DeleteUserProfile(
    $input: DeleteUserProfileInput!
    $condition: ModelUserProfileConditionInput
  ) {
    deleteUserProfile(input: $input, condition: $condition) {
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
export const createTwitterPost = /* GraphQL */ `
  mutation CreateTwitterPost(
    $input: CreateTwitterPostInput!
    $condition: ModelTwitterPostConditionInput
  ) {
    createTwitterPost(input: $input, condition: $condition) {
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
export const updateTwitterPost = /* GraphQL */ `
  mutation UpdateTwitterPost(
    $input: UpdateTwitterPostInput!
    $condition: ModelTwitterPostConditionInput
  ) {
    updateTwitterPost(input: $input, condition: $condition) {
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
export const deleteTwitterPost = /* GraphQL */ `
  mutation DeleteTwitterPost(
    $input: DeleteTwitterPostInput!
    $condition: ModelTwitterPostConditionInput
  ) {
    deleteTwitterPost(input: $input, condition: $condition) {
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
export const createYoutubePost = /* GraphQL */ `
  mutation CreateYoutubePost(
    $input: CreateYoutubePostInput!
    $condition: ModelYoutubePostConditionInput
  ) {
    createYoutubePost(input: $input, condition: $condition) {
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
export const updateYoutubePost = /* GraphQL */ `
  mutation UpdateYoutubePost(
    $input: UpdateYoutubePostInput!
    $condition: ModelYoutubePostConditionInput
  ) {
    updateYoutubePost(input: $input, condition: $condition) {
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
export const deleteYoutubePost = /* GraphQL */ `
  mutation DeleteYoutubePost(
    $input: DeleteYoutubePostInput!
    $condition: ModelYoutubePostConditionInput
  ) {
    deleteYoutubePost(input: $input, condition: $condition) {
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
export const createInstagramPost = /* GraphQL */ `
  mutation CreateInstagramPost(
    $input: CreateInstagramPostInput!
    $condition: ModelInstagramPostConditionInput
  ) {
    createInstagramPost(input: $input, condition: $condition) {
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
export const updateInstagramPost = /* GraphQL */ `
  mutation UpdateInstagramPost(
    $input: UpdateInstagramPostInput!
    $condition: ModelInstagramPostConditionInput
  ) {
    updateInstagramPost(input: $input, condition: $condition) {
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
export const deleteInstagramPost = /* GraphQL */ `
  mutation DeleteInstagramPost(
    $input: DeleteInstagramPostInput!
    $condition: ModelInstagramPostConditionInput
  ) {
    deleteInstagramPost(input: $input, condition: $condition) {
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
export const createTiktokPost = /* GraphQL */ `
  mutation CreateTiktokPost(
    $input: CreateTiktokPostInput!
    $condition: ModelTiktokPostConditionInput
  ) {
    createTiktokPost(input: $input, condition: $condition) {
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
      shareCount
      updatedAt
    }
  }
`;
export const updateTiktokPost = /* GraphQL */ `
  mutation UpdateTiktokPost(
    $input: UpdateTiktokPostInput!
    $condition: ModelTiktokPostConditionInput
  ) {
    updateTiktokPost(input: $input, condition: $condition) {
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
      shareCount
      updatedAt
    }
  }
`;
export const deleteTiktokPost = /* GraphQL */ `
  mutation DeleteTiktokPost(
    $input: DeleteTiktokPostInput!
    $condition: ModelTiktokPostConditionInput
  ) {
    deleteTiktokPost(input: $input, condition: $condition) {
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
      shareCount
      updatedAt
    }
  }
`;
