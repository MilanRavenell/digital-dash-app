export const getData = /* GraphQL */ `
  query GetData(
    $username: String!,
    $selectedProfileNames: [String!],
    $startDate: String,
    $endDate: String,
    $timezoneOffset: Int,
  ) {
    getData(input: {
      username: $username,
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
        profiles {
          platform
          profileName
          user
          profilePicUrl
          followerCount
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
      username: $username,
      profileKey: $profileKey,
    }) {
      success
      dataUpdated
    }
  }
`;

export const deleteProfile = /* GraphQL */ `
  mutation DeleteProfile($username: String!, $profileKey: String!) {
    deleteProfile(input: {
      username: $username,
      profileKey: $profileKey,
    }) {
      success
    }
  }
`;