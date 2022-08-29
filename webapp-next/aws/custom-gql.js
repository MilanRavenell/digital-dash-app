export const getData = /* GraphQL */ `
  query GetData($username: String!) {
    getData(input: {username: $username}) {
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
        }
        timeframes {
          graphPartitions
          name
          partitionDate
        }
      }
      success
    }
  }
`;

export const findProfiles = /* GraphQL */ `
  query FindProfiles($platform: String!, $accessToken: String!) {
    findProfiles(input: {
      accessToken: $accessToken,
      platform: $platform,
    }) {
      profiles {
        profileName
        meta
      }
      success
    }
  }
`;