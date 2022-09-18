from content_data_scraper import ContentDataScraper
import datetime
import time

class TikTokScraper(ContentDataScraper):
    def __init__(self, handle):
        super().__init__()

        self.handle = handle
        self.metrics_records = []
        self.profile_url = (f'https://www.tiktok.com/@{self.handle}')
    
    async def open_page(self):
        await self.page.goto(self.profile_url, {'timeout': 60000})
        user_page_div = await self.find_element_with_timeout(self.page, '//div[@data-e2e="user-avatar"]')
        return (user_page_div is not None)

    async def load_new_content(self):
        await self.page.evaluate('window.scrollTo(0, document.body.scrollHeight);')
    
    async def process_content(self, content):
        return await self.__process_video(content)

    async def get_loaded_content(self):
        content_list =  await self.page.Jx('//div[@data-e2e="user-post-item"]')
        return [await self.get_content_identifier(content) for content in content_list]

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

    async def close(self):
        await super().close()

    ########################## TikTok Methods ##############################
    async def __process_video(self, video_id):
        record = {}
        url = f'https://www.tiktok.com/@{self.handle}/video/{video_id}'

        record['profile'] = self.handle
        record['id'] = video_id

        video = await self.find_elements_safe(self.page, f'//a[@href="{url}"]')
        attempts = 0
        while video == None and attempts < 10:
            print('next page')
            await self.load_new_content()
            video = await self.find_elements_safe(self.page, f'//a[@href="{url}"]')
            time.sleep(1)

        record['views'] = self.get_int_from_string(await self.__extract_attribute(video, './/strong[@data-e2e="video-views"]'))

        thumbnail_img = await self.find_elements_safe(video, 'img', byxpath=False)
        record['thumbnail_url'] = await (await thumbnail_img.getProperty('src')).jsonValue()
        record['caption'] = await (await thumbnail_img.getProperty('alt')).jsonValue()

        new_page = await self.get_new_page()
        await new_page.goto(url , {'timeout': 60000})
        await self.find_element_with_timeout(new_page, '//strong[@data-e2e="like-count"]')

        record['likes'] = self.get_int_from_string(await self.__extract_attribute(new_page, '//strong[@data-e2e="like-count"]'))
        record['comments'] = self.get_int_from_string(await self.__extract_attribute(new_page, '//strong[@data-e2e="comment-count"]'))
        record['shares'] = self.get_int_from_string(await self.__extract_attribute(new_page, '//strong[@data-e2e="share-count"]'))
        record['date'] = await self.get_date(new_page)

        await new_page.close()

        print(record)
        return record

    async def __extract_attribute(self, page, xpath):
        element =  await self.find_element_with_timeout(page, xpath)

        for key in (await element.getProperties()):
            if '__reactProps' in key:
                return (await (await element.getProperty(key)).jsonValue())['children']
    
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