from pyppeteer import launch
import asyncio
import pyppeteer
from random_user_agent.user_agent import UserAgent
from random_user_agent.params import SoftwareName, OperatingSystem
import time
import os
import requests
import platform
import subprocess
import signal
import sys
import random
from devices import devices

SOCKS_PORT = 9050
NUM_RETRIES = 10

#TODO: Optimize by opening a driver per content(limit on number of active drivers at once)
class ContentDataScraper:
    def __init__(self, use_tor, task, content_id):
        self.seen_content_ids = set()
        self.time_start = time.time()
        self.no_new_content = 0
        self.use_tor = use_tor
        self.tor_process = None
        self.browser = None
        self.mobile = False
        self.task = task
        self.content_id = content_id
    
    def run(self):
        return asyncio.get_event_loop().run_until_complete(self.arun(
            gather_content_only=(self.task == 'get_content'),
            content_to_process=self.content_id,
            verify_bio=(self.task == 'verify_bio_contains_token'),
            get_profile_info=(self.task == 'get_profile_info'),
        ))

    async def arun(self, gather_content_only=False, content_to_process=None, verify_bio=False, get_profile_info=False):
        tries = 0
        success = False
        result = None

        while not success and (time.time() - self.time_start < 900):
            tries = tries + 1

            try:
                if self.use_tor:
                    self.__start_tor_proxy()
                await self.__init_page()

                if await self.open_page():
                    result = await self.main(gather_content_only, content_to_process, verify_bio, get_profile_info)
                    success = True
                    print(result)
                    print('Done :DD')
                else:
                    print('Failed to open page')
            except Exception as e:
                print(f'attempt {tries} failed to run')
                print(str(e))
            
            await self.close()

        return result        

    async def main(self, gather_content_only, content_to_process, verify_bio, get_profile_info):
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
            result = await self.process_content_page()
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
                    coroutines = [self.process_content(content) for content in new_content]
                    results.extend(await asyncio.gather(*coroutines))

            await self.load_new_content()

        return results
        
    async def filter_seen_content(self, content_list):
        content_with_ids = [(content, await self.get_content_identifier(content)) for content in content_list]
        unseen_content = [content[0] for content in content_with_ids if content[1] not in self.seen_content_ids]
        [self.seen_content_ids.add(content[1]) for content in content_with_ids]

        return unseen_content

    def is_finished(self):
        return (time.time() - self.time_start > 200) or (self.no_new_content >= 10)
    
    def __start_tor_proxy(self):
        oper_sys = platform.system()

        if oper_sys == 'Linux':
            tor_path = os.path.join(os.getcwd(), 'Tor_linux', 'Tor', 'tor') 
            torrc_path = os.path.join(os.getcwd(), 'tor_config', 'torrc')
            self.tor_process = subprocess.Popen(
                [tor_path, '-f', torrc_path],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                shell=True,
                preexec_fn=os.setsid,
            )
        else:
            tor_path = os.path.join(os.getcwd(), 'Tor_mac', 'tor.real')
            self.tor_process = subprocess.Popen(
                [tor_path],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                shell=True,
                preexec_fn=os.setsid,
            )
        
        print('starting tor')

        proxy_launch_start = time.time()
        while self.tor_process.stdout.readable():
            line = self.tor_process.stdout.readline()

            if not line:
                break

            print(line.strip())
            
            if 'Bootstrapped 100% (done): Done' in line.strip().decode('utf-8'):
                break

            # Give the machine 30 seconds to boot tor service
            if time.time() - proxy_launch_start > 30:
                raise 'Tor service timed out'

        print('Tor started')

        # print origin IP
        r = requests.Session()
        proxies = {
            'http': 'socks5://localhost:' + str(SOCKS_PORT),
            'https': 'socks5://localhost:' + str(SOCKS_PORT)
        }
        response = r.get("http://ip-api.com/json/", proxies=proxies)
        print('exit node: ', response.json())
    
    async def __init_page(self):
        isRunningLocally = os.environ.get('AWS_EXECUTION_ENV') == None
        chromiumPath =  os.path.join(os.getcwd(), 'headless-chromium')
        proxyServer = f'--proxy-server={"socks5://localhost:9050" if self.use_tor else "gate.smartproxy.com:7000"}'

        self.browser = await launch(
            headless=True,
            args=[
                '--start-fullscreen',
                '--no-sandbox',
                '--single-process',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-zygote',
                proxyServer,
            ],
            executablePath=chromiumPath if not isRunningLocally else None,
            userDataDir="/tmp",
        )

        print('browser launched')
        self.page = await self.get_new_page()

    def __get_headers(self):
        return {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "sec-ch-ua": '.Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "macOS",
            "upgrade-insecure-requests": "1",
            "user-agent": 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
        }

    async def open_page(self):
        url = self.get_url()
        print(f'opening {url}')
        await self.page.goto(url,  {'waitUntil': 'networkidle0', 'timeout': 120000})

        if self.page_test_el:
            user_page_div = await self.find_element_with_timeout(self.page, self.page_test_el)
            return (user_page_div is not None)
        else:
            return True
    
    async def get_new_page(self):
        page = await self.browser.newPage()
        if self.mobile:
            await page.emulate(random.choice(devices))
        else:
            await page.setExtraHTTPHeaders(headers=self.__get_headers())

        if not self.use_tor:
            await page.authenticate({
                'username': 'digitaldash',
                'password': 'digitaldash02',
            })

        await page.setRequestInterception(True)
        page.on('request', lambda req: asyncio.ensure_future(self.request_handler(req)))
        page.on('response', lambda resp: asyncio.ensure_future(self.response_handler(resp)))

        return page

    async def close(self):
        print('closing')
        if self.browser:
            await self.browser.close()
        if self.tor_process:
            self.tor_process.kill()

    async def find_element_with_timeout(self, page, query, byxpath=True):
        print('finding ' + query)
        attempts = 0
        while attempts < 3:
            results = (await page.Jx(query)) if byxpath else (await page.JJ(query))
            if results and not len(results) == 0:
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
        if ('TTGCaptcha' in page_html):
            print('Caught by CAPTCHA')
        if ('The link you followed may be broken, or the page may have been removed.' in page_html):
            print('IG page not found')
        else:
            print(page_html)

    async def get_url(self):
        raise NotImplementedError()

    async def get_loaded_content(self):
        raise NotImplementedError()
    
    async def load_new_content(self):
        raise NotImplementedError()

    async def process_content(self, content):
        raise NotImplementedError()
        
    async def process_content_page(self, content_id):
        raise NotImplementedError()

    def get_content_identifier(self, content):
        raise NotImplementedError()

    async def verify_bio(self):
        raise  NotImplementedError()
    
    async def get_profile(self):
        raise  NotImplementedError()

    async def request_handler(self, request):
        await request.continue_()
        return
    
    async def response_handler(self, response):
        return

