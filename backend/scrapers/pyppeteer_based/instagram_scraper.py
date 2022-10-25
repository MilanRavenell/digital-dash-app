from content_data_scraper import ContentDataScraper
import datetime
import time
import json

class InstagramScraper(ContentDataScraper):
    def __init__(self, use_tor, handle, task, content_id=None):
        super().__init__(use_tor, task, content_id)

        self.handle = handle
        self.metrics_records = []
        self.page_test_el = None
        self.response_handler_data = None
        self.mobile = True
        self.finished = False
    
    def get_url(self):
        if self.task == 'process_single_content':
            return f'https://www.instagram.com/p/{self.content_id}/'
        
        return f'https://www.instagram.com/{self.handle}/'

    async def get_profile(self):
        record = {}

        if self.response_handler_data and 'data' in self.response_handler_data and 'user' in self.response_handler_data['data']:
            data_user = self.response_handler_data['data']['user']
            if 'profile_pic_url' in data_user:
                record['profile_pic_url'] = data_user['profile_pic_url']
        
            if 'edge_followed_by' in data_user:
                record['followers'] = data_user['edge_followed_by']['count']
            
            print(record)
            return record
    
    async def load_new_content(self):
        await self.page.evaluate('window.scrollTo(0, document.body.scrollHeight);')

    async def get_loaded_content(self):
        if self.response_handler_data:
            content = self.response_handler_data['data']['user']['edge_owner_to_timeline_media']['edges']
            # Reset response_handler_data to fetch more data
            self.response_handler_data = None
            return [node.get('node') for node in content]
        
        return []

    async def get_content_identifier(self, content):
        return content.get('id')

    async def process_content(self, content):
        print('getting content')
        # Only do one content discovery iteration
        self.finished = True

        caption = None
        caption_edges = content.get('edge_media_to_caption', {}).get('edges', [])
        if len(caption_edges) > 0:
            caption = caption_edges[0].get('node', {}).get('text')

        return {
            'id': content.get('id'),
            'shortcode': content.get('shortcode'),
            'comments': content.get('edge_media_to_comment', {}).get('count', 0),
            'views': content.get('video_view_count'),
            'likes': content.get('edge_media_preview_like', {}).get('count'),
            'taken_at_timestamp': content.get('taken_at_timestamp'),
            'media_info': self.__get_media(content),
            'caption': caption,
        }

    async def process_content_page(self):
        if self.response_handler_data:
            return await self.process_content(self.response_handler_data.get('data', {}).get('shortcode_media'))

    async def close(self):
        await super().close()

    async def response_handler(self, response):
        try:
            response_json = json.loads(await response.text())

            if self.task == 'process_single_content':
                if 'data' in response_json and 'shortcode_media' in response_json['data']:
                    self.response_handler_data = response_json

            if self.task == 'get_profile_info' or self.task == 'get_content' or self.task == 'full_run':
                if 'data' in response_json and 'user' in response_json['data']:
                    self.response_handler_data = response_json

        except:
            pass

    async def request_handler(self, request):
        try:
            if self.response_handler_data or 'jpg' in request.url:
                await request.abort()
            else:
                await request.continue_()
        except Exception as e:
            print(e)

    def is_finished(self):
        return self.finished

    ########################## Instagram Methods ##############################
    def __get_media(self, node):
        if node.get('__typename') == 'GraphSidecar':
            return [{
                'thumbnail_url': child.get('node', {}).get('display_url'),
                'media_type': child.get('node', {}).get('__typename')
            }  for child in node.get('edge_sidecar_to_children', {}).get('edges', [])]
        
        return [{
            'thumbnail_url': node.get('thumbnail_src'),
            'media_type': node.get('__typename'),
        }]