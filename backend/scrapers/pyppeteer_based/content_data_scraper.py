from pyppeteer import launch
import asyncio
from random_user_agent.user_agent import UserAgent
from random_user_agent.params import SoftwareName, OperatingSystem
import time

#TODO: Optimize by opening a driver per content(limit on number of active drivers at once)
class ContentDataScraper:
    def __init__(self):
        self.seen_content_ids = set()
        self.time_start = time.time()

        self.data_folder = '/Users/milanravenell/Documents/digital_dash/backend/data'

    def run(self):
        asyncio.get_event_loop().run_until_complete(self.arun())

    async def arun(self):
        await self.__init_page()
        await self.open_page()
        await self.get_analytics()
        await self.close()

    async def get_analytics(self):
        while not self.is_finished():
            new_content = await self.filter_seen_content(await self.get_loaded_content())

            for content in new_content:
                await self.process_content(content)
            # TODO: Get coroutines working
            # coroutines = [self.process_content(content) for content in new_content]
            # await asyncio.gather(*coroutines)

            await self.load_new_content()

    async def filter_seen_content(self, content_list):
        content_with_ids = [(content, await self.get_content_identifier(content)) for content in content_list]
        unseen_content = [content[0] for content in content_with_ids if content[1] not in self.seen_content_ids]
        [self.seen_content_ids.add(content[1]) for content in content_with_ids]

        print(unseen_content)
        return unseen_content

    def is_finished(self):
        return (time.time() - self.time_start > 200)
    
    async def __init_page(self):
        self.browser = await launch(headless=True, args=['--start-fullscreen'])
        self.page = await self.get_new_page()

    def __get_headers(self):
        # software_names = [SoftwareName.CHROME.value]
        # operating_systems = [OperatingSystem.MAC.value]
        # user_agent_rotator = UserAgent(software_names=software_names, operating_systems=operating_systems, limit=100)
        # user_agent = user_agent_rotator.get_random_user_agent()
        user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'

        return {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            # "sec-ch-ua": '.Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "macOS",
            "upgrade-insecure-requests": "1",
            "user-agent": user_agent,
        }
    
    async def get_new_page(self):
        page = await self.browser.newPage()
        await page.setExtraHTTPHeaders(headers=self.__get_headers())
        return page

    async def close(self):
        await self.browser.close()

    @staticmethod
    async def find_element_with_timeout(page, query, byxpath=True):
        print('finding ' + query)
        attempts = 0
        while attempts < 99:
            results = (await page.Jx(query)) if byxpath else (await page.JJ(query))
            if not results == []:
                if len(results) == 1:
                    return results[0]

                return results

            time.sleep(1)
            attempts += 1
                
        print('Failed to retrieve element')

    @staticmethod
    def get_int_from_string(num):
        print(num)
        num = num.replace(',', '')

        if (num == ''):
            return 0
        if 'K' in num:
            num = float(num.split('K')[0]) * 1000
        elif 'M' in num:
            num = float(num.split('M')[0]) * 1000000

        return int(num)

    async def get_loaded_content(self):
        raise NotImplementedError()
    
    async def load_new_content(self):
        raise NotImplementedError()

    async def process_content(self, content):
        raise NotImplementedError()

    async def open_page(self):
        raise NotImplementedError()

    def get_content_identifier(self, content):
        raise NotImplementedError()

