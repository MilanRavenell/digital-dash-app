from content_data_scraper import ContentDataScraper

from time import sleep
import sys
import datetime

class YoutubeScraper(ContentDataScraper):
    def __init__(self, handle):
        super().__init__()

        self.metrics_records = []
        self.handle = handle
    
    async def open_page(self):
        print('opening page')
        sys.stdout.flush()
        await self.page.goto(f'https://www.youtube.com/c/{self.handle}/videos')
        sleep(1)

    async def load_new_content(self):
        await self.page.evaluate('window.scrollTo(0, document.body.scrollHeight);')
        sleep(1)
    
    async def process_content(self, content):
        await self.__process_video(content)

    async def get_loaded_content(self):
        return await self.find_element_with_timeout(self.page, 'ytd-grid-video-renderer', False)

    async def get_content_identifier(self, content):
        return await self.page.evaluate('e => e.getAttribute("href")',  await self.find_element_with_timeout(content, './/a[@id="video-title"]'))

    async def close(self):
        await super().close()

    ########################## YouTube Methods ##############################
    async def __process_video(self, video):
        print('processing video')
        sys.stdout.flush()

        url = await self.get_content_identifier(video)
        print(url)

        new_page = await self.get_new_page()
        await new_page.goto(f'https://www.youtube.com{url}')
        
        sleep(7)

        # Scroll to bottom to load all necessary elements
        scrollHeight = (await (await self.find_element_with_timeout(new_page, 'ytd-app', False)).boundingBox())['height']
        print(scrollHeight)
        await new_page.evaluate(f'window.scrollTo(0, {scrollHeight});')

        sleep(2)

        n_views = await self.__get_views(new_page)
        n_likes = self.get_int_from_string(await new_page.evaluate('e => e.textContent', (await new_page.Jx('//yt-formatted-string[contains(@aria-label, "likes")]'))[0]))
        n_comments = await self.__get_comments(new_page)
        date = await self.__get_date(new_page)
        title = await self.__get_title(new_page)

        record = {
            'id': url,
            'views': n_views,
            'engagements': n_likes,
            'comments': n_comments,
            'date': date,
            'title': title,
        }

        print(record)
        sys.stdout.flush()
        self.metrics_records.append(record)

        await new_page.close()

        sleep(1)
    
    # Location of the view div can differ between different loads, need to check two possible locations
    async def __get_views(self, page):
        views = None
        attempts = 0
        while attempts < 99:
            try:
                el = (await page.Jx('//span[contains(@class, "view-count")]'))[0]
                views = (await page.evaluate('e => e.textContent', el)).split(' views')[0]
                break
            except IndexError:
                pass

            try:
                snippet_text_el = (await page.Jx('//yt-formatted-string[@id="formatted-snippet-text"]'))[0]
                span_el = (await snippet_text_el.Jx('.//span[contains(@class, bold)][contains(text(), "views")]'))[0]
                views = (await page.evaluate('e => e.textContent', span_el))[0].split(' views')[0]
                break
            except IndexError:
                pass

            attempts += 1
        
        if views is not None:
            return self.get_int_from_string(views)

    async def __get_comments(self, page):
        comments = None
        attempts = 0
        while attempts < 99:
            try:
                comment_el = (await page.Jx('//h2[@id="count"]'))[0]
                comment_span_el = (await (await comment_el.J('yt-formatted-string')).Jx('.//span[1]'))[0]
                comments = await page.evaluate('e => e.textContent', comment_span_el)
                break
            except IndexError:
                pass

            try:
                el = (await page.Jx('//div[@id="count"]'))[0]
                comments = await page.evaluate('e => e.textContent', el)
                break
            except IndexError:
                pass

            attempts += 1
        
        if comments is not None:
            return self.get_int_from_string(comments)

    async def __get_date(self, page):
        date = None
        attempts = 0
        while attempts < 99:
            try:
                date_div_el = (await page.Jx('//div[@id="info-strings"]'))[0]
                date_el = await date_div_el.J('yt-formatted-string')
                date = await page.evaluate('e => e.textContent', date_el)
                break
            except IndexError:
                pass

            try:
                snippet_text_el = (await page.Jx('//yt-formatted-string[@id="formatted-snippet-text"]'))[0]
                span_el = (await snippet_text_el.Jx('.//span[3]'))[0]
                date = (await page.evaluate('e => e.textContent', span_el))[0]
                break
            except IndexError:
                pass

            attempts += 1

        if date is not None:
            if 'Premiered' in date:
                date = date.split('Premiered ')[1]

            if 'Streamed live on' in date:
                date = date.split('Streamed live on ')[1]

            return datetime.datetime.strptime(date, '%b %d, %Y').isoformat()

    async def __get_title(self, page):
        info_contents_div = await self.find_element_with_timeout(page, '//div[@id="info-contents"]')
        title_h1 = await self.find_element_with_timeout(info_contents_div, './/h1[contains(@class, "title")]')
        yt_formatted_string_el = await self.find_element_with_timeout(title_h1, 'yt-formatted-string', False)
        return await page.evaluate('e => e.textContent', yt_formatted_string_el)
