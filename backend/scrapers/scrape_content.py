import sys
sys.path.append('/Users/milanravenell/Documents/digital_dash/backend/scrapers/pyppeteer_based')

from pyppeteer_based import *

def get_scraper_from_platform(platform):
    match platform:
        case 'twitter':
            try:
                handle = sys.argv[2]
                password = sys.argv[3]
                phone_number = sys.argv[4]

                return TwitterScraper(handle, password, phone_number)
            except IndexError:
                print('Not enough arguments were supplied for twitter scraper')
                return
        case 'youtube':
            try:
                handle = sys.argv[2]

                return YoutubeScraper(handle)
            except IndexError:
                print('Not enough arguments were supplied for twitter scraper')
                return
        case 'tiktok':
            try:
                handle = sys.argv[2]

                return TikTokScraper(handle)
            except IndexError:
                print('Not enough arguments were supplied for twitter scraper')
                return
            

content_scraper = get_scraper_from_platform(sys.argv[1])
content_scraper.run()
