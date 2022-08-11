from content_data_scraper import ContentDataScraper
import pandas as pd
from time import sleep
import datetime

class TwitterScraper(ContentDataScraper):
    def __init__(self, username, password, phone_number):
        super().__init__()

        self.metrics_records = []
        self.liked_users_records = []

        self.handle = username
        self.password = password
        self.phone_number = phone_number

    async def open_page(self):
        await self.login()
        await self.navigate_to_analytics()

    async def load_new_content(self):
        await self.navigate_to_first_of_prev_month()

    async def process_content(self, content):
        await self.process_tweet(content)
        await self.get_liked_users_from_tweet(content)

    async def get_loaded_content(self):
        await self.find_element_with_timeout(self.page, '//div[@id="tweet-activity-container"]')
        print(await self.page.Jx('//li[@class="topn-page tweet-activity-tweet-group"]'))
        return await self.page.Jx('//li[@class="topn-page tweet-activity-tweet-group"]')

    async def get_content_identifier(self, content):
        print(await self.page.evaluate('(element) => element.getAttribute("data-tweet-id")', content))
        return await self.page.evaluate('(element) => element.getAttribute("data-tweet-id")', content)

    async def close(self):
        await super().close()

        df_metrics = pd.DataFrame.from_records(self.metrics_records)
        df_metrics.to_csv(f'{self.data_folder}/twitter/{self.handle}.csv')

        df_likes = pd.DataFrame.from_records(self.liked_users_records)
        df_likes.to_csv(f'{self.data_folder}/twitter/{self.handle}_likes.csv')

    ##################### Twitter Methods ###############################
    async def login(self):
        print('logging in')

        await self.page.goto('https://www.twitter.com/login')

        username = await self.find_element_with_timeout(self.page, '//input[@autocomplete="username"]')
        await username.type('milanravenell@gmail.com')
        await username.press('Enter')

        # wait for page to load
        await self.find_element_with_timeout(self.page, 'input', False)

        # Sometimes twitter will ask for phone number
        requests_phone_number = not (await self.page.Jx('//span[contains(text(), "Enter your phone number or username")]')) == []
        if (requests_phone_number):
            text_input = await self.find_element_with_timeout(self.page, 'input', False)
            await text_input.type(self.phone_number)
            await text_input.press('Enter')
        
        password = await self.find_element_with_timeout(self.page, '//input[@name="password"]')

        await password.type(self.password)
        await password.press('Enter')

    async def navigate_to_analytics(self):
        print('navigating to analytics')

        await self.find_element_with_timeout(self.page, '//a[@aria-label="Profile"]')
        await self.page.goto(f'https://analytics.twitter.com/user/{self.handle}/tweets')

        tweets_and_replies = await self.find_element_with_timeout(self.page, '//a[@id="tweets-and-replies-filter"]')
        await self.page.evaluate('el => el.click()', tweets_and_replies)

        sleep(1)

    async def navigate_to_first_of_prev_month(self):
        print('navigating to first of prev month')

        date_picker_button = await self.find_element_with_timeout(self.page, '//div[@id="daterange-button"]')
        bounding_box = await date_picker_button.boundingBox()
        x = bounding_box['x'] + bounding_box['width']
        y = bounding_box['y'] + bounding_box['height']
        await self.page.evaluate(f'window.scrollTo({x}, {y})')
        await date_picker_button.click()

        # Open calendar
        left_calendar = await self.find_element_with_timeout(self.page, '//div[@class="calendar left"]')

        sleep(1)

        # Click prev button
        prev_button = await self.find_element_with_timeout(left_calendar, './/th[@class="prev available"]')
        await self.page.evaluate('el => el.click()', prev_button)

        sleep(1)

        # Click first of the month
        first_of_the_month = (await self.find_element_with_timeout(left_calendar, './/td[text()="1"]'))[0]
        await self.page.evaluate('el => el.click()', first_of_the_month)

        sleep(1)

        # Click update button
        update_button = await self.find_element_with_timeout(self.page, '//button[contains(text(), "Update")]')
        await self.page.evaluate('el => el.click()', update_button)

        sleep(1)

    async def process_tweet(self, tweet):
        print('processing tweet')

        record = {}
        record['profile'] = self.handle
        record['id'] = await self.get_content_identifier(tweet)

        # Get date
        record['date'] = await self.get_date(tweet)

        # Get title
        title_el = await self.find_element_with_timeout(tweet, './/span[@class="tweet-text"]')
        print(title_el)
        record['title'] = await self.page.evaluate('e => e.textContent', title_el)

        # Click tweet to open ifram with metrics
        await self.page.evaluate('el=>el.click()', tweet)

        # Get views
        try:
            frame = await (await self.find_element_with_timeout(self.page, 'iframe', False)).contentFrame()
            impressions_el = (await (await frame.Jx('//div[@class="ep-ImpressionsSection"]'))[0].Jx('.//span[@class="ep-MetricAnimation"]'))[0]
            record['views'] = self.get_int_from_string(await frame.evaluate('(e) => e.textContent', impressions_el))
        except IndexError:
            pass

        # Get engagement
        try:
            engagements_div = (await frame.Jx('//div[@class="ep-EngagementsSection"]'))[0]
            engagements_el = (await engagements_div.Jx('.//span[@class="ep-MetricAnimation"]'))[0]
            record['engagements'] = self.get_int_from_string(await frame.evaluate('(e) => e.textContent', engagements_el))

            engagement_rows = await (await engagements_div.J('tbody')).JJ('tr')
            for row in engagement_rows:
                engagement_type = await frame.evaluate(
                    '(e) => e.textContent',
                    (await row.Jx('.//span[@class="ep-EngagementsTableName"]'))[0]
                )
                engagement_value = await frame.evaluate(
                    '(e) => e.textContent',
                    (await row.Jx('.//span[@class="ep-MetricAnimation"]'))[0]
                )

                record[self.clean_string(engagement_type)] = self.get_int_from_string(self.clean_string(engagement_value))
        except IndexError:
            pass

        # Close the tweet metrics window
        close_button = (await self.page.Jx('//button[@class="Sheet-close"]'))[0]
        await self.page.evaluate('el => el.click()', close_button)

        print(record)
        self.metrics_records.append(record)

        sleep(1)

    async def get_date(self, tweet):
        tweet_id = await self.get_content_identifier(tweet)
        new_page = await self.get_new_page()
        await new_page.goto(f'https://twitter.com/{self.handle}/status/{tweet_id}')

        date_link_el = await self.find_element_with_timeout(new_page, f'//a[@href="/{self.handle}/status/{tweet_id}"][@role="link"]')
        date = await new_page.evaluate('e => e.textContent', await self.find_element_with_timeout(date_link_el, 'span', False))

        await new_page.close()

        date_split = date.split()
        date_formatted = date_split[3] + ' ' + date_split[4] + ' ' + date_split[5] + ' ' + date_split[0] + date_split[1]

        return datetime.datetime.strptime(date_formatted, '%b %d, %Y %I:%M%p').isoformat()
    
    async def get_liked_users_from_tweet(self, tweet):
        tweet_id = await self.get_content_identifier(tweet)
        new_page = await self.get_new_page()
        await new_page.goto(f'https://twitter.com/{self.handle}/status/{tweet_id}/likes')

        has_likes = await self.get_likes_page_has_likes(new_page)

        if not has_likes:
            print('No likes')
            return []

        # Get all liked users if there are any
        header = await self.find_element_with_timeout(new_page, '//div[@aria-label="Timeline: Liked by"]')

        # wait for users to load
        await self.find_element_with_timeout(header, './/div[@data-testid="cellInnerDiv"]')
        users = await self.find_element_with_timeout(header, './/div[@data-testid="cellInnerDiv"]')

        user_records = []
        for user in users:
            try:
                user_id = await new_page.evaluate('e => e.textContent', (await user.Jx('.//span[contains(text(), "@")]'))[0])
                user_records.append({
                    'id': tweet_id,
                    'owner': self.handle,
                    'liked_by': user_id
                })
            except IndexError:
                continue
        
        print(user_records)
        self.liked_users_records.extend(user_records)

        await new_page.close()

    async def get_likes_page_has_likes(self, page):
        # Wait for page to load
        attempts = 0
        while attempts < 99:
            print('loading....')
            attempts += 1

            # No likes
            try:
                (await page.Jx('//span[text()="No Tweet Likes yet"]'))[0]
                print('No likes')

                return False
            except IndexError:
                pass
            
            # Likes
            try:
                (await page.Jx('//div[@aria-label="Timeline: Liked by"]'))[0]
                return True
            except IndexError:
                pass
        
        return False

    @staticmethod
    def clean_string(text):
        return ''.join(c for c in text if c.isalnum())