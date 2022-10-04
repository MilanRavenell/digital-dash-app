from content_data_scraper import ContentDataScraper
import datetime
import time
import json

class InstagramScraper(ContentDataScraper):
    def __init__(self, use_tor, handle, content_id=None):
        super().__init__(use_tor)

        self.handle = handle
        self.metrics_records = []
        self.url = f'https://www.instagram.com/p/{content_id}/' if content_id else f'https://www.instagram.com/{self.handle}/'
        self.page_test_el = None
        self.response_handler_data = []
        self.mobile = True

    async def get_profile(self):
        record = {}

        for data in self.response_handler_data:
            if data and data['data'] and data['data']['user']:
                data_user = data['data']['user']
                if data_user['profile_pic_url']:
                    record['profile_pic_url'] = data_user['profile_pic_url']
            
                if data_user['edge_followed_by']:
                    record['followers'] = data_user['edge_followed_by']['count']
                
                print(record)
                return record

    async def process_content_page(self):
        record = {}

        for data in self.response_handler_data:
            if data and data['data'] and data['data']['shortcode_media']:
                data_shortcode_media = data['data']['shortcode_media']
                if data_shortcode_media['edge_media_preview_like']:
                    record['likes'] = data_shortcode_media['edge_media_preview_like']['count']
            
                if data_shortcode_media['edge_media_to_parent_comment']:
                    record['comments'] = data_shortcode_media['edge_media_to_parent_comment']['count']
                
                print(record)
                return record

        

    async def close(self):
        await super().close()

    async def response_handler(self, response):
        try:
            if ('/query' in response.url and 'variables' in response.url) or 'username' in response.url:
                response_json = json.loads(await response.text())
                if response_json['data'] and (response_json['data']['shortcode_media'] or response_json['data']['user']):
                    self.response_handler_data.append(response_json)
        except:
            pass

    async def request_handler(self, request):
        try:
            if len(self.response_handler_data) > 0:
                await request.abort()
            else:
                await request.continue_()
        except Exception as e:
            print(e)

    ########################## Instagram Methods ##############################