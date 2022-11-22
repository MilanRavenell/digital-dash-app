from scrape_content import handler

print(handler({
    'platform': 'tiktok',
    'handle': 'techroastshow',
    'task': 'process_single_content',
    'content_to_process': '7163174832136293674',
    'use_tor': False,
}, {}))
