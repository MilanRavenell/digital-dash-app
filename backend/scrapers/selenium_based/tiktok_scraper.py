from content_data_scraper import ContentDataScraper

from selenium.webdriver import Edge
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import pandas as pd
import time

class TikTokScraper(ContentDataScraper):
    def __init__(self):
        super().__init__()

        self.video_driver = Edge(options=self.options, service=self.service)
        self.metrics_records = []
        self.handle = 'techroastshow'
    
    def open_page(self):
        self.driver.get(f'https://www.tiktok.com/@{self.handle}')

    #TODO: Figure out how to load more content
    def load_new_content(self):
        return
    
    def process_content(self, content):
        self.__process_video(content)

    def get_loaded_content(self):
        return self.driver.find_elements(By.XPATH, '//div[@data-e2e="user-post-item"]')

    def get_content_identifier(self, content):
        return self.find_element_with_timeout(content, By.TAG_NAME, 'a').get_attribute('href')

    def close(self):
        super().close()

        df_metrics = pd.DataFrame.from_records(self.metrics_records)
        df_metrics.to_csv(f'../data/tiktok/{self.handle}.csv')

    ########################## YouTube Methods ##############################
    def __process_video(self, video):
        record = {}
        record['profile'] = self.handle
        record['id'] = self.get_content_identifier(video)
        record['views'] = video.find_element(By.XPATH, './/strong[@data-e2e="video-views"]').text

        url = self.get_content_identifier(video)
        self.video_driver.get(url)

        try:
            #TODO: Get Date
            record['likes'] = self.find_element_with_timeout(self.video_driver, By.XPATH, '//strong[@data-e2e="like-count"]').text
            record['comments'] = self.find_element_with_timeout(self.video_driver, By.XPATH, '//strong[@data-e2e="comment-count"]').text
            record['shares'] = self.find_element_with_timeout(self.video_driver, By.XPATH, '//strong[@data-e2e="share-count"]').text

            print(record)
            self.metrics_records.append(record)
        except NoSuchElementException:
            pass
