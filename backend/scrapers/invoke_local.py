from scrape_content import handler

print(handler({
    'platform': 'tiktok',
    'handle': 'techroastshow',
    'task': 'process_single_content',
    'content_to_process': '7151891791090814254',
    'use_tor': True,
}, {}))
