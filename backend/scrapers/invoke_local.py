from scrape_content import handler

print(handler({
    'platform': 'tiktok',
    'handle': 'techroastshow',
    'task': 'full_run',
    # 'content_to_process': '7159595680594529582',
    'use_tor': True,
}, {}))
