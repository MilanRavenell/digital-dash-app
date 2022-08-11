import csv
from selenium.webdriver.edge.service import Service
from selenium.webdriver import Edge, EdgeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from getpass import getpass
import os
import pandas as pd
import time
from selenium.common.exceptions import NoSuchElementException
from time import sleep

#TODO: Optimize by opening a driver per content(limit on number of active drivers at once)
class ContentDataScraper:
    def __init__(self):
        self.service = Service(executable_path='./drivers/msedgedriver')
        self.options = EdgeOptions()
        self.options.use_chromium = True

        self.driver = Edge(options=self.options, service=self.service)

        self.time_start = None
        self.seen_content_ids = set()
        self.time_start = time.time()

    def run(self):
        self.open_page()
        self.get_analytics()
        self.close()

    def perform_action_in_new_tab(self, driver, url, action, args):
        driver.execute_script("window.open('');")
        driver.switch_to.window(driver.window_handles[1])
        driver.get(url)

        result = action(args)

        driver.close()
        driver.switch_to.window(driver.window_handles[0])

        return result

    def get_analytics(self):
        while not self.is_finished():
            new_content = self.filter_seen_content(self.get_loaded_content())

            for content in new_content:
                self.process_content(content)

            self.load_new_content()

    def filter_seen_content(self, content_list):
        content_with_ids = [(content, self.get_content_identifier(content)) for content in content_list]
        unseen_content = [content[0] for content in content_with_ids if content[1] not in self.seen_content_ids]
        [self.seen_content_ids.add(content[1]) for content in content_with_ids]

        return unseen_content

    def is_finished(self):
        return (time.time() - self.time_start > 20)

    @staticmethod
    def find_element_with_timeout(driver, by, query, mult=False):
        element = None
        attempts = 0
        while element is None and attempts < 99:
            try:
                if mult:
                    return driver.find_elements(by, query)
                else:
                    return driver.find_element(by, query)
            except NoSuchElementException:
                print('Could not find element, retrying')
                sleep(1)
                attempts += 1
                
        print('Failed to retrieve element')
    
    def close(self):
        self.driver.quit()
        
        # close all open browser instances
        os.system('killall -9 "Microsoft Edge"')

    def get_loaded_content(self):
        raise NotImplementedError()
    
    def load_new_content(self):
        raise NotImplementedError()

    def process_content(self, content):
        raise NotImplementedError()

    def open_page(self):
        raise NotImplementedError()

    def get_content_identifier(self, content):
        raise NotImplementedError()

