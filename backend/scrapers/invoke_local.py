from scrape_content import handler

print(handler({
    'platform': 'tiktok',
    'handle': 'orbrealtimeanalytics',
    'task': 'full_run',
    # 'content_to_process': '7163174832136293674',
    'use_tor': False,
}, {}))
