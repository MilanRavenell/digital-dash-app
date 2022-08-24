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
          profilePic {
            url
            width
            height
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
            likeCount
            mediaEngagementCount
            profileClickCount
            profileName
            replyCount
            updatedAt
            viewCount
            link
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