from pyppeteer import launch
import asyncio
from random_user_agent.user_agent import UserAgent
from random_user_agent.params import SoftwareName, OperatingSystem
import time
import os

#TODO: Optimize by opening a driver per content(limit on number of active drivers at once)
class ContentDataScraper:
    def __init__(self):
        self.seen_content_ids = set()
        self.time_start = time.time()
        self.no_new_content = 0

    def full_run(self):
        return asyncio.get_event_loop().run_until_complete(self.arun())

    def get_content(self):
        return asyncio.get_event_loop().run_until_complete(self.arun(gather_content_only=True))

    def process_single_content(self, content_to_process):
        return asyncio.get_event_loop().run_until_complete(self.arun(content_to_process=content_to_process))

    def verify_bio_contains_token(self):
        return asyncio.get_event_loop().run_until_complete(self.arun(verify_bio=True))
    
    def get_profile_info(self):
        return asyncio.get_event_loop().run_until_complete(self.arun(get_profile_info=True))

    async def arun(self, gather_content_only=False, content_to_process=None, verify_bio=False, get_profile_info=False):
        await self.__init_page()
        pageOpened = await self.open_page()
        if not pageOpened:
            print('Failed to open page')
            return None

        # Only for tiktok
        if verify_bio:
            if (await self.verify_bio()):
                return await self.get_profile()
            else:
                return None

        if get_profile_info:
            return await self.get_profile()

        # Does not work for twitter
        if content_to_process is not None:
            result = await self.process_content(content_to_process)
            await self.close()
            return result

        results = []
        while not self.is_finished():
            new_content = await self.filter_seen_content(await self.get_loaded_content())

            if len(new_content) == 0:
                self.no_new_content += 1
            else:
                self.no_new_content = 0

                if gather_content_only:
                    results.extend(new_content)
                else:
                    for content in new_content:
                        results.append(await self.process_content(content))
                    # TODO: Get coroutines working
                    # coroutines = [self.process_content(content) for content in new_content]
                    # await asyncio.gather(*coroutines)

            await self.load_new_content()

        await self.close()
        return results
        
    async def filter_seen_content(self, content_list):
        unseen_content = [content for content in content_list if content not in self.seen_content_ids]
        [self.seen_content_ids.add(content) for content in content_list]

        print(unseen_content)
        return unseen_content

    def is_finished(self):
        return (time.time() - self.time_start > 200) or (self.no_new_content >= 5)
    
    async def __init_page(self):
        isRunningLocally = os.environ.get('AWS_EXECUTION_ENV') == None
        chromiumPath =  os.path.join(os.getcwd(), 'headless-chromium')

        self.browser = await launch(
            headless=True,
            args=[
                '--start-fullscreen',
                '--no-sandbox',
                '--single-process',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-zygote',
                '--proxy-server=gate.smartproxy.com:7000'
            ],
            executablePath=chromiumPath if not isRunningLocally else None,
            userDataDir="/tmp",
        )
        self.page = await self.get_new_page()
        await self.page.authenticate({
            'username': 'sp45767889',
            'password': 'digitaldash01',
        })

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

    async def find_element_with_timeout(self, page, query, byxpath=True):
        print('finding ' + query)
        attempts = 0
        while attempts < 3:
            results = (await page.Jx(query)) if byxpath else (await page.JJ(query))
            if not results == []:
                if len(results) == 1:
                    return results[0]

                return results

            time.sleep(1)
            attempts += 1
                
        print('Failed to retrieve element')
        await self.handle_failure(page)

    async def find_elements_safe(self, page, query, byxpath=True):
        print('finding ' + query)

        results = (await page.Jx(query)) if byxpath else (await page.JJ(query))
        if len(results) == 0:
            return None

        if len(results) == 1:
            return results[0]

        return results

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

    @staticmethod
    async def handle_failure(page):
        page_html = await page.evaluate('document.documentElement.outerHTML')
        if ('To protect users from unusual network activity, we use Captcha to verify that you are not a robot.' in page_html):
            print('Caught by CAPTCHA')
        else:
            print(page_html)

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

    async def verify_bio(self):
        raise  NotImplementedError()
    
    async def get_profile(self):
        raise  NotImplementedError()

