from content_data_scraper import ContentDataScraper
import datetime
import time
import json

class TikTokScraper(ContentDataScraper):
    def __init__(self, use_tor, handle, task, content_id=None):
        super().__init__(use_tor, task, content_id)

        self.handle = handle
        self.metrics_records = []
        self.page_test_el = '//strong[@data-e2e="like-count"]' if task == 'process_single_content' else '//div[@data-e2e="user-avatar"]'
        self.response_handler_data = None
        self.finished = False

    def get_url(self):
        if self.task == 'process_single_content':
            return f'https://www.tiktok.com/@{self.handle}/video/{self.content_id}'
        
        return f'https://www.tiktok.com/@{self.handle}'

    async def load_new_content(self):
        if self.finished:
            return []

        await self.page.evaluate('window.scrollTo(0, document.body.scrollHeight);')
        start = time.time()
        
        try:
            response = await self.page.waitForResponse(lambda res: 'api/post/item_list/' in res.url, { 'timeout': 30000 })
            print(await response.text())
            text = await response.text()
            self.response_handler_data = json.loads(text)
        except:
            self.finished = True

        print(f'Found content in {time.time() - start}')
        
    
    async def process_content(self, content):
        if type(content).__name__ == 'ElementHandle':
            return await self.__process_video_html(content)
        else:
            return self.__process_video_json(content)
            

    async def get_loaded_content(self):
        if self.response_handler_data:
            content = self.response_handler_data.get('itemList')
            self.finished = not self.response_handler_data.get('hasMore')
            self.response_handler_data = None
            return content
        else:
            content =  await self.page.Jx('//div[@data-e2e="user-post-item"]')
            if len(content) < 30:
                self.finished = True
            return content

    async def get_content_identifier(self, content):
        if type(content).__name__ == 'ElementHandle':
            return (await (await (await content.J('a')).getProperty('href')).jsonValue()).split('video/')[1]
        else:
            return content.get('id')

    async def verify_bio(self):
        bio = await self.__extract_attribute(self.page, '//h2[@data-e2e="user-bio"]')

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

        thumbnail_img = await self.find_elements_safe(self.page, '//img[contains(@class, "ImgPoster")]')
        record['thumbnail_url'] = await (await thumbnail_img.getProperty('src')).jsonValue()
        record['caption'] = await (await thumbnail_img.getProperty('alt')).jsonValue()

        return record

    async def close(self):
        await super().close()
    
    def is_finished(self):
        return self.finished

    async def request_handler(self, request):
        if self.task == 'get_profile_info' or self.task == 'process_single_content':
            if request.url == self.get_url():
                await request.continue_()
            else:
                await request.abort()
        
        else:
            await request.continue_()

    ########################## TikTok Methods ##############################
    async def __process_video_html(self, video):
        record = {}

        record['profile'] = self.handle
        record['id'] = await self.get_content_identifier(video)
        record['views'] = self.get_int_from_string(await self.__extract_attribute(video, './/strong[@data-e2e="video-views"]'))

        return record
    
    def __process_video_json(self, video):
        record = {}

        record['profile'] = self.handle
        record['id'] = video.get('id')
        record['views'] = video.get('stats', {}).get('playCount')

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

            if 'w' in time_ago:
                weeks_ago = int(time_ago.split('w')[0])
                return (now - datetime.timedelta(days=(weeks_ago * 7))).isoformat()

            if 'm' in time_ago:
                minutes_ago = int(time_ago.split('m')[0])
                return (now - datetime.timedelta(minutes=minutes_ago)).isoformat()

            if 's' in time_ago:
                seconds_ago = int(time_ago.split('s')[0])
                return (now - datetime.timedelta(seconds=seconds_ago)).isoformat()

        date = date_str.split('-')
        if len(date) == 2:
            return datetime.datetime(now.year, int(date[0]), int(date[1])).isoformat()

        if len(date) == 3:
            return datetime.datetime(int(date[0]), int(date[1]), int(date[2])).isoformat()