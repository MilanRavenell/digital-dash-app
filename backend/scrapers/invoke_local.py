from scrape_content import handler

print(handler({
    'platform': 'tiktok',
    'handle': 'latimes_food',
    'task': 'full_run',
    # 'content_to_process': 'CjBT20EPxIy',
    'use_tor': True,
}, {}))
