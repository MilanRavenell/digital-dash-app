const {
    csvHelpers: {
        readFromCsvFile,
    },
} = require('./helpers');

const platforms = ['twitter', 'youtube', 'tiktok'];

// Must be reverse ordered chronologically
const timeframes = [
    { name: 'day', nDays: 1 },
    { name: 'month', nDays: 30 },
    { name: 'year', nDays: 365 },
    { name: 'all time' }
];

const metrics = ['views', 'engagements'];

async function getData(username) {
    const profiles = await getUserProfiles(username);
    const records = await getRecords(profiles);

    return {
        profiles,
        timeframes: timeframes.map(timeframe => ({
            name: timeframe.name,
            partitionDate: getDatePartitions(timeframe.nDays),
            graphPartitions: getGraphPartitionsFromTimeframe(timeframe.name)
        })),
        metrics,
        records: records.map(record => formatRecord(record)),
        postHeaders: {
            'global': [
                'Platform',
                'Title',
                'Views',
                'Total Engagement',
                'Date',
            ],
            'twitter': [
                'Title',
                'Views',
                'Profile Clicks',
                'Likes',
                'Detail Expands',
                'Media Engagements',
                'Replies',
                'Date',
            ],
            'youtube': [
                'Title',
                'Views',
                'Likes',
                'Comments',
                'Date',
            ]
        }
    };
}

async function getUserProfiles(username) {
    const {
        twitter_user,
        youtube_user,
        tiktok_user,
    } = (await readFromCsvFile('data/users.csv')).find(user => (user.username === username));

    return [
        { platform: 'twitter', username: twitter_user }, 
        { platform: 'youtube', username: youtube_user },
        { platform: 'tiktok', username: tiktok_user },
    ].filter(({ username }) => (username != ''));
}

async function getRecords(profiles) {
    const records = [];

    for (const { platform, username } of profiles) {
        if (username != '') {
            records.push(
                ...(await readFromCsvFile(`data/${platform}/${username}.csv`))
                    .map(record => ({
                        ...record,
                        platform,
                        username,
                    }))
            );
        }
    }

    records.sort((a, b) => {
        return (new Date(b.date) - new Date(a.date))
    });

    return records;
}

function getGraphPartitionsFromTimeframe(timeframe) {
    const date = new Date();
    date.setMinutes(0, 0, 0)
    const partitions = [];

    switch(timeframe){
        case 'day':
            for (let i = 0; i < 24; i++) {
                date.setHours(date.getHours() - 1);
                partitions.push(date.toISOString())
            }
            break;
        case 'month':
            date.setHours(0);
            for (let i = 0; i < 30; i++) {
                date.setDate(date.getDate() - 1);
                partitions.push(date.toISOString())
            }
            break;
        case 'year':
        case 'all time':
            date.setHours(0);
            date.setDate(0);
            for (let i = 0; i < 12; i++) {
                date.setMonth(date.getMonth() - 1);
                partitions.push(date.toISOString())
            }
            break;
    };

    return partitions;
}

function getDatePartitions(nDays) {
    if (nDays === undefined) {
        return null;
    };

    const date = new Date();
    date.setDate(date.getDate() - nDays);
    return date;
}

function formatRecord(record) {
    switch(record.platform) {
        case 'twitter':
            return {
                ...record,
                'Platform': 'twitter',
                'Link': `https://www.twitter.com/${record.profile}/status/${record.id}`,
                'Views': record.views || 0,
                'Total Engagement': record.engagements || 0,
                'Profile Clicks': record.Profileclicks || 0,
                'Likes': record.Likes || 0,
                'Detail Expands': record.Detailexpands || 0,
                'Media Engagements': record.Mediaengagements || 0,
                'Replies': record.Replies || 0,
                'Date': record.date || 0,
                'Title': record.title || '',
            };
        case 'youtube':
            return {
                ...record,
                'Platform': 'youtube',
                'Link': `https://www.youtube.com${record.id}`,
                'Views': record.views,
                'Total Engagement': parseInt(record.engagements) + parseInt(record.comments),
                'Likes': record.engagements,
                'Comments': record.comments,
                'Date': record.date,
                'Title': record.title || '',
            };
    }
}

module.exports = getData;