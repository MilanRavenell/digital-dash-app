from content_data_scraper import ContentDataScraper
import datetime
import time

class TikTokScraper(ContentDataScraper):
    def __init__(self, use_tor, handle, content_id=None):
        super().__init__(use_tor)

        self.handle = handle
        self.metrics_records = []
        self.url = f'https://www.tiktok.com/@{self.handle}/video/{content_id}' if content_id else f'https://www.tiktok.com/@{self.handle}'
        self.page_test_el = '//strong[@data-e2e="like-count"]' if content_id else '//div[@data-e2e="user-avatar"]'

    async def load_new_content(self):
        await self.page.evaluate('window.scrollTo(0, document.body.scrollHeight);')
    
    async def process_content(self, content):
        return await self.__process_video(content)

    async def get_loaded_content(self):
        return await self.page.Jx('//div[@data-e2e="user-post-item"]')

    async def get_content_identifier(self, content):
        return (await (await (await content.J('a')).getProperty('href')).jsonValue()).split('video/')[1]

    async def verify_bio(self):
        bio = await self.__extract_attribute(self.page, '//h2[@data-e2e="user-bio"]')
        print(bio)

        return (bio.find('digitaldashappXD') != -1)

    async def get_profile(self):
        user_page_div = await self.find_element_with_timeout(self.page, '//div[@data-e2e="user-avatar"]')
        profile_pic_img = await self.find_elements_safe(user_page_div, 'img', byxpath=False)
        profile_pic_url = await (await profile_pic_img.getProperty('src')).jsonValue()

        followers = self.get_int_from_string(await self.__extract_attribute(self.page, '//strong[@data-e2e="followers-count"]'))

        return {
            'profile_pic_url': profile_pic_url,
            'followers': followers, 
        }

    async def process_content_page(self):
        await self.find_element_with_timeout(self.page, '//strong[@data-e2e="like-count"]')

        record = {}
        record['likes'] = self.get_int_from_string(await self.__extract_attribute(self.page, '//strong[@data-e2e="like-count"]'))
        record['comments'] = self.get_int_from_string(await self.__extract_attribute(self.page, '//strong[@data-e2e="comment-count"]'))
        record['shares'] = self.get_int_from_string(await self.__extract_attribute(self.page, '//strong[@data-e2e="share-count"]'))
        record['date'] = await self.get_date(self.page)

        print(record)
        return record

    async def close(self):
        await super().close()

    ########################## TikTok Methods ##############################
    async def __process_video(self, video):
        record = {}

        record['profile'] = self.handle
        record['id'] = await self.get_content_identifier(video)
        record['views'] = self.get_int_from_string(await self.__extract_attribute(video, './/strong[@data-e2e="video-views"]'))

        thumbnail_img = await self.find_elements_safe(video, 'img', byxpath=False)
        record['thumbnail_url'] = await (await thumbnail_img.getProperty('src')).jsonValue()
        record['caption'] = await (await thumbnail_img.getProperty('alt')).jsonValue()

        return record

    async def __extract_attribute(self, page, xpath):
        element =  await self.find_element_with_timeout(page, xpath)
        return await self.page.evaluate('e => e.textContent', element)
    
    async def get_date(self, page):
        browser_nickname_span = await self.find_elements_safe(page, '//span[@data-e2e="browser-nickname"]')
        date_str = await self.__extract_attribute(browser_nickname_span, './/span[2]')
        print(date_str)
        now = datetime.datetime.now()

        if 'ago' in date_str: 
            time_ago = date_str.split(' ago')[0]
            if 'h' in time_ago:
                hours_ago = int(time_ago.split('h')[0])
                return (now - datetime.timedelta(hours=hours_ago)).isoformat()
            
            if 'd' in time_ago:
                days_ago = int(time_ago.split('d')[0])
                return (now - datetime.timedelta(days=days_ago)).isoformat()

        date = date_str.split('-')
        if len(date) == 2:
            return datetime.datetime(now.year, int(date[0]), int(date[1])).isoformat()

        if len(date) == 3:
            return datetime.datetime(int(date[0]), int(date[1]), int(date[2])).isoformat()