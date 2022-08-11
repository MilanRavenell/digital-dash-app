from content_data_scraper import ContentDataScraper

from selenium.webdriver import Edge
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import NoSuchElementException
from time import sleep
import os
import pandas as pd

class TwitterScraper(ContentDataScraper):
    def __init__(self, username, password):
        super().__init__()

        self.likes_driver = Edge(options=self.options, service=self.service)
        self.metrics_records = []
        self.liked_users_records = []

        self.handle = ''

    def open_page(self):
        self.login(self.driver)
        self.login(self.likes_driver)
        self.navigate_to_analytics(self.driver)

    def load_new_content(self):
        self.navigate_to_first_of_prev_month()

    def process_content(self, content):
        self.get_metrics_from_tweet(content)
        self.get_liked_users_from_tweet(content)

    def get_loaded_content(self):
        return self.find_element_with_timeout(self.driver, By.XPATH, '//li[@class="topn-page tweet-activity-tweet-group"]', True)

    def get_content_identifier(self, content):
        return content.get_attribute('data-tweet-id')
    
    def close(self):
        super().close()
        self.likes_driver.close()

        df_metrics = pd.DataFrame.from_records(self.metrics_records)
        df_metrics.to_csv(f'../data/twitter/{self.handle}.csv')

        df_likes = pd.DataFrame.from_records(self.liked_users_records)
        df_likes.to_csv(f'../data/twitter/{self.handle}_likes.csv')

    ##################### Twitter Methods ###############################
    def login(self, driver):
        driver.get('https://www.twitter.com/login')

        username = self.find_element_with_timeout(driver, By.XPATH, '//input[@autocomplete="username"]')
        username.send_keys('milanravenell@gmail.com')
        username.send_keys(Keys.RETURN)

        text_input = self.find_element_with_timeout(driver, By.TAG_NAME, 'input')
        password = None

        # Sometimes twitter will ask for phone number
        try:
            driver.find_element(By.XPATH, '//span[contains(text(), "Enter your phone number or username")]')
            text_input.send_keys('4044223280')
            text_input.send_keys(Keys.RETURN)

            password = self.find_element_with_timeout(driver, By.XPATH, '//input[@name="password"]')
        except NoSuchElementException:
            password = text_input

        password.send_keys(os.getenv('PASS'))
        password.send_keys(Keys.RETURN)

    def navigate_to_analytics(self, driver):
        profile_button = self.find_element_with_timeout(driver, By.XPATH, '//a[@aria-label="Profile"]')
        profile_button.click()

        self.handle = driver.current_url.split('https://twitter.com/')[1]
        self.driver.get(f'https://analytics.twitter.com/user/{self.handle}/tweets')

        tweets_and_replies = self.find_element_with_timeout(driver, By.XPATH, '//a[@id="tweets-and-replies-filter"]')
        tweets_and_replies.click()
        sleep(1)

    def navigate_to_first_of_prev_month(self):
        date_picker_button = self.driver.find_element(By.XPATH, '//div[@id="daterange-button"]')

        # Scroll to date picker
        y = date_picker_button.location['y']
        height = date_picker_button.size['height']
        self.driver.execute_script(f'window.scrollTo(0, {y - height});')

        date_picker_button.click()

        # Open calendar
        left_calendar = self.driver.find_element(By.XPATH, '//div[@class="calendar left"]')

        # Click prev button
        prev_button = left_calendar.find_element(By.XPATH, './/th[@class="prev available"]')
        prev_button.click()

        # Click first of the month
        first_of_the_month = left_calendar.find_element(By.XPATH, '//td[text()="1"]')
        first_of_the_month.click()

        # Click update button
        update_button = self.driver.find_element(By.XPATH, '//button[contains(text(), "Update")]')
        update_button.click()

        sleep(1)

    #TODO: Get date
    def get_metrics_from_tweet(self, tweet):
        record = {}
        record['profile'] = self.handle
        record['id'] = self.get_content_identifier(tweet)

        # Scroll to tweet
        tweet_y = tweet.location['y']
        tweet_height = tweet.size['height']
        self.driver.execute_script(f'window.scrollTo(0, {tweet_y - tweet_height});')

        # Click on top left corner of tweet to prevent accidentally clicking hyperlinks
        action = ActionChains(self.driver)
        action.move_to_element_with_offset(tweet, 5, 5)
        action.click()
        action.perform()

        # Open tweet metrics window and get metrics
        self.driver.switch_to.frame(self.driver.find_element(By.TAG_NAME, 'iframe'))
        try:
            impression_div = self.driver.find_element(By.XPATH, '//div[@class="ep-ImpressionsSection"]')
            n_impressions = impression_div.find_element(By.XPATH, './/span[@class="ep-MetricAnimation"]').text
            record['impressions'] = n_impressions
        except NoSuchElementException:
            pass

        try:
            engagements_div = self.driver.find_element(By.XPATH, '//div[@class="ep-EngagementsSection"]')
            n_engagements = engagements_div.find_element(By.TAG_NAME, 'thead').find_element(By.XPATH, './/span[@class="ep-MetricAnimation"]').text
            record['total_engagements'] = n_engagements

            engagement_rows = engagements_div.find_element(By.TAG_NAME, 'tbody').find_elements(By.TAG_NAME, 'tr')
            for row in engagement_rows:
                engagement_type = row.find_element(By.XPATH, './/span[@class="ep-EngagementsTableName"]').text
                engagement_value = row.find_element(By.XPATH, './/span[@class="ep-MetricAnimation"]').text

                record[engagement_type] = engagement_value
        except NoSuchElementException:
            pass

        # Close the tweet metrics window
        self.driver.switch_to.default_content()
        close_button = self.driver.find_element(By.XPATH, '//button[@class="Sheet-close"]')
        close_button.click()

        print(record)
        self.metrics_records.append(record)
    
    def get_liked_users_from_tweet(self, tweet):
        tweet_id = self.get_content_identifier(tweet)
        self.likes_driver.get(f'https://twitter.com/{self.handle}/status/{tweet_id}/likes')

        has_likes = self.get_likes_page_has_likes()

        if not has_likes:
            print('No likes')
            return []

        # Get all liked users if there are any
        header = self.find_element_with_timeout(self.likes_driver, By.XPATH, '//div[@aria-label="Timeline: Liked by"]')

        # wait for users to load
        self.find_element_with_timeout(header, By.XPATH, './/div[@data-testid="cellInnerDiv"]')
        users = self.find_element_with_timeout(header, By.XPATH, './/div[@data-testid="cellInnerDiv"]', True)

        user_records = []
        for user in users:
            try:
                user_id = user.find_element(By.XPATH, './/span[contains(text(), "@")]')
                user_records.append({
                    'id': tweet_id,
                    'owner': self.handle,
                    'liked_by': user_id.text
                })
            except NoSuchElementException:
                continue
        
        print(user_records)
        self.liked_users_records.extend(user_records)

    def get_likes_page_has_likes(self):
        # Wait for page to load
        attempts = 0
        while attempts < 99:
            print('loading....')
            attempts += 1

            # No likes
            try:
                self.likes_driver.find_element(By.XPATH, '//span[text()="No Tweet Likes yet"]')
                print('No likes')

                return False
            except NoSuchElementException:
                pass
            
            # Likes
            try:
                self.likes_driver.find_element(By.XPATH, '//div[@aria-label="Timeline: Liked by"]')
                return True
            except NoSuchElementException:
                pass
        
        return False