export const getData = /* GraphQL */ `
  query GetUser($username: String!) {
    getData(input: {username: $username}) {
      data {
        metrics {
          displayName
          field
        }
        postHeaders {
          metrics {
            displayName
            field
          }
          platform
        }
        profiles {
          createdAt
          platform
          profileName
          updatedAt
          user
        }
        records {
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