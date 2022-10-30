from scrape_content import handler

print(handler({
    'platform': 'tiktok',
    'handle': 'techroastshow',
    'task': 'full_run',
    # 'content_to_process': '7159714698362129710',
    'use_tor': True,
}, {}))
