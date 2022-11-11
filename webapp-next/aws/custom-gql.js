export const getData = /* GraphQL */ `
  query GetData(
    $owner: String!,
    $selectedProfileNames: [String!],
    $startDate: String,
    $endDate: String,
    $timezoneOffset: Int,
  ) {
    getData(input: {
      owner: $owner,
      selectedProfileNames: $selectedProfileNames,
      startDate: $startDate,
      endDate: $endDate,
      timezoneOffset: $timezoneOffset,
    }) {
      data {
        metrics {
          field
          displayName
        }
        postHeaders {
          metrics {
            displayName
            field
          }
          platform
        }
        graphs {
          name
          type
          graph {
            labels
            datasets {
              label
              data
              backgroundColor
              borderColor
            }
          }
        }
        aggregated {
          previousComparisonTimeframeStart
          previousComparisonTimeframeEnd
          stats {
            name
            value
            percentDiff
          }
        }
        records {
          __typename
          ... on TwitterPost {
            id
            caption
            createdAt
            datePosted
            detailExpandCount
            engagementCount
            engagementRate
            likeCount
            mediaEngagementCount
            profileClickCount
            profileName
            replyCount
            updatedAt
            viewCount
            link
            media {
              thumbnailUrl
              type
            }
          }
          ... on YoutubePost {
            id
            caption
            commentCount
            createdAt
            datePosted
            engagementCount
            engagementRate
            likeCount
            profileName
            updatedAt
            viewCount
            link
            media {
              thumbnailUrl
              type
            }
          }
          ... on InstagramPost {
            id
            caption
            commentCount
            createdAt
            datePosted
            engagementCount
            engagementRate
            likeCount
            link
            profileName
            reachCount
            saveCount
            updatedAt
            viewCount
            media {
              thumbnailUrl
              type
            }
          }
          ... on TiktokPost {
            id
            caption
            commentCount
            createdAt
            datePosted
            engagementCount
            engagementRate
            likeCount
            link
            profileName
            shareCount
            updatedAt
            viewCount
            media {
              thumbnailUrl
              type
            }
          }
        }
        timeframes {
          name
          startDate
          endDate
        }
      }
      success
    }
  }
`;

export const populateAnalytics = /* GraphQL */ `
  mutation PopulateAnalytics($username: String!, $profileKey: String!) {
    populateAnalytics(input: {
      owner: $owner,
      profileKey: $profileKey,
    }) {
      success
      dataUpdated
    }
  }
`;

export const deleteProfile = /* GraphQL */ `
  mutation DeleteProfile($owner: String!, $profileKey: String!) {
    deleteProfile(input: {
      owner: $owner,
      profileKey: $profileKey,
    }) {
      success
    }
  }
`;

export const invokeWebScraper = /* GraphQL */ `
  query InvokeWebScraper($options: String!) {
    invokeWebScraper(input: {
      options: $options,
    }) {
      response
    }
  }
`;

export const triggerSqs = /* GraphQL */ `
  mutation TriggerSqs($queueUrl: String!, $body: String!) {
    triggerSqs(input: {
      queueUrl: $queueUrl,
      body: $body,
    }) {
      success
    }
  }
`;

export const initUser = /* GraphQL */ `
  mutation InitUser($email: String!, $firstName: String!, $lastName: String!, $owner: String!) {
    initUser(input: {
      email: $email,
      firstName: $firstName,
      lastName: $lastName,
      owner: $owner,
    }) {
      success
      user {
        owner
        email
        firstName
        lastName
      }
    }
  }
`;