from content_data_scraper import ContentDataScraper

import pandas as pd
import time

class TikTokScraper(ContentDataScraper):
    def __init__(self, handle):
        super().__init__()

        self.handle = handle
        self.metrics_records = []
        self.profile_url = (f'https://www.tiktok.com/@{self.handle}')
    
    async def open_page(self):
        await self.page.goto(self.profile_url)

    async def load_new_content(self):
        await self.page.evaluate('window.scrollTo(0, document.body.scrollHeight);')
    
    async def process_content(self, content):
        await self.__process_video(content)

    async def get_loaded_content(self):
        return await self.page.Jx('//div[@data-e2e="user-post-item"]')

    async def get_content_identifier(self, content):
        return await (await (await content.J('a')).getProperty('href')).jsonValue()

    async def close(self):
        await super().close()

        df_metrics = pd.DataFrame.from_records(self.metrics_records)
        df_metrics.to_csv(f'{self.data_folder}/tiktok/{self.handle}.csv')

    ########################## YouTube Methods ##############################
    async def __process_video(self, video):
        record = {}
        record['profile'] = self.handle
        record['id'] = await self.get_content_identifier(video)
        record['views'] = self.get_int_from_string(await self.__extract_attribute(video, './/strong[@data-e2e="video-views"]'))

        url = await self.get_content_identifier(video)
        print(url)
        new_page = await self.get_new_page()
        await new_page.goto(url)

        #TODO: Get Date
        record['likes'] = self.get_int_from_string(await self.__extract_attribute(new_page, '//strong[@data-e2e="like-count"]'))
        record['comments'] = self.get_int_from_string(await self.__extract_attribute(new_page, '//strong[@data-e2e="comment-count"]'))
        record['shares'] = self.get_int_from_string(await self.__extract_attribute(new_page, '//strong[@data-e2e="share-count"]'))

        print(record)
        self.metrics_records.append(record)

        await new_page.close()

    async def __extract_attribute(self, page, xpath):
        element = (await page.Jx(xpath))[0]

        for key in (await element.getProperties()):
            if '__reactProps' in key:
                return (await (await element.getProperty(key)).jsonValue())['children']
