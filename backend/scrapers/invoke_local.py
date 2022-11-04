from scrape_content import handler

print(handler({
    'platform': 'instagram',
    'handle': 'yungmilly69',
    'task': 'get_profile_info',
    # 'content_to_process': '7159714698362129710',
    'use_tor': False,
}, {}))
