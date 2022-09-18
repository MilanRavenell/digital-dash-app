import sys
import os
import json

file_dir = os.path.dirname(os.path.realpath(__file__))
sys.path.append(os.path.join(file_dir, 'pyppeteer_based'))

from pyppeteer_based import *

def get_scraper_from_platform(platform, handle):
    if platform == 'twitter':
        try:
            password = sys.argv[3]
            phone_number = sys.argv[4]

            return TwitterScraper(handle, password, phone_number)
        except IndexError:
            print('Not enough arguments were supplied for twitter scraper')
            return
    if platform == 'youtube':
        try:
            return YoutubeScraper(handle)
        except IndexError:
            print('Not enough arguments were supplied for twitter scraper')
            return
    if platform == 'tiktok':
        try:
            return TikTokScraper(handle)
        except IndexError:
            print('Not enough arguments were supplied for twitter scraper')
            return

def handler(event, context):
    print(event)
    print(context)

    platform = event.get('platform')
    handle = event.get('handle')
    task = event.get('task')

    content_scraper = get_scraper_from_platform(platform, handle)
    if task == 'full_run':
        return content_scraper.full_run()
    
    if task == 'get_content':
        return content_scraper.get_content()
    
    if task == 'process_single_content':
        content_to_process = event.get('content_to_process')
        return content_scraper.process_single_content(content_to_process)

    if task == 'verify_bio_contains_token':
        return content_scraper.verify_bio_contains_token()

    if task == 'get_profile_info':
        return content_scraper.get_profile_info()
