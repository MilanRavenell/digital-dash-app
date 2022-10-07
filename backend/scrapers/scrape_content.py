import sys
import os
import json

file_dir = os.path.dirname(os.path.realpath(__file__))
sys.path.append(os.path.join(file_dir, 'pyppeteer_based'))

from pyppeteer_based import *

def get_scraper_from_platform(platform, use_tor, handle, task, content_to_process):
    if platform == 'twitter':
        try:
            password = sys.argv[3]
            phone_number = sys.argv[4]

            return TwitterScraper(handle, task, password, phone_number)
        except IndexError:
            print('Not enough arguments were supplied for twitter scraper')
            return
    if platform == 'youtube':
        try:
            return YoutubeScraper(handle, task)
        except IndexError:
            print('Not enough arguments were supplied for twitter scraper')
            return
    if platform == 'tiktok':
        try:
            return TikTokScraper(use_tor, handle, task, content_to_process)
        except IndexError:
            print('Not enough arguments were supplied for twitter scraper')
            return
    if platform == 'instagram':
        try:
            return InstagramScraper(use_tor, handle, task, content_to_process)
        except IndexError:
            print('Not enough arguments were supplied for twitter scraper')
            return

def handler(event, context):
    print(event)
    print(context)

    platform = event.get('platform')
    handle = event.get('handle')
    task = event.get('task')
    content_to_process = event.get('content_to_process')
    use_tor = event.get('use_tor', False)

    content_scraper = get_scraper_from_platform(platform, use_tor, handle, task, content_to_process)
    return content_scraper.run()