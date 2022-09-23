from scrape_content import handler

print(handler({
    'platform': 'tiktok',
    'handle': 'techroastshow',
    'task': 'get_profile_info',
    'content_to_process': '7143382915702033710',
}, {}))
