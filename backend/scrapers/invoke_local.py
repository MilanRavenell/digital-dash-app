from scrape_content import handler

print(handler({
    'platform': 'tiktok',
    'handle': 'techroastshow',
    'task': 'full_run',
    # 'content_to_process': '7082485715208047918',
    'use_tor': False,
}, {}))
