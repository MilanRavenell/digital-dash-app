/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
      platform
      profileName
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
      platform
      profileName
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
      platform
      profileName
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
      viewCount
      engagementCount
      likeCount
      commentCount
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
      viewCount
      engagementCount
      likeCount
      commentCount
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
      viewCount
      engagementCount
      likeCount
      commentCount
      updatedAt
    }
  }
`;
