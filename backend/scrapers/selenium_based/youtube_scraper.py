from content_data_scraper import ContentDataScraper

from selenium.webdriver import Edge
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import pandas as pd
import time

class YoutubeScraper(ContentDataScraper):
    def __init__(self, handle):
        super().__init__()

        self.video_driver = Edge(options=self.options, service=self.service)
        self.metrics_records = []
        self.handle = handle
    
    def open_page(self):
        self.driver.get(f'https://www.youtube.com/c/{self.handle}/videos')

    def load_new_content(self):
        self.driver.execute_script('window.scrollTo(0, document.body.scrollHeight);')
    
    def process_content(self, content):
        self.__process_video(content)

    def get_loaded_content(self):
        return self.driver.find_elements(By.TAG_NAME, 'ytd-grid-video-renderer')

    def get_content_identifier(self, content):
        return self.find_element_with_timeout(content, By.XPATH, './/a[@id="video-title"]').get_attribute('href')

    def close(self):
        super().close()

        df_metrics = pd.DataFrame.from_records(self.metrics_records)
        df_metrics.to_csv(f'../data/youtube/{self.handle}.csv')

    ########################## YouTube Methods ##############################
    def __process_video(self, video):
        url = self.get_content_identifier(video)
        self.video_driver.get(url)

        # Scroll to bottom to load all necessary elements
        scrollHeight = self.find_element_with_timeout(self.video_driver, By.TAG_NAME, 'ytd-app').size['height']
        self.video_driver.execute_script(f'window.scrollTo(0, {scrollHeight});')

        try:
            n_views = self.__get_views(self.video_driver)
            n_likes = self.find_element_with_timeout(self.video_driver, By.XPATH, '//yt-formatted-string[contains(@aria-label, "likes")]').text
            n_comments = self.find_element_with_timeout(self.video_driver, By.XPATH, '//yt-formatted-string[contains(@class, "ytd-comments-header-renderer")]').find_element(By.XPATH, './/span[1]').text

            #TODO: Get Date
            record = {
                'id': url,
                'views': n_views,
                'engagements': n_likes,
                'comments': n_comments
            }

            print(record)
            self.metrics_records.append(record)
        except NoSuchElementException:
            pass
    
    def __get_views(self, driver):
        attempts = 0
        while attempts < 99:
            try:
                return driver.find_element(By.XPATH, '//span[contains(@class, "view-count")]').text.split(' views')[0]
            except NoSuchElementException:
                pass

            try:
                return driver.find_element(By.XPATH, '//div[@id="snippet"]').find_element(By.XPATH, './/span[contains(@class, bold)][contains(text(), "views")]').text.split(' views')[0]
            except NoSuchElementException:
                pass

            attempts += 1
