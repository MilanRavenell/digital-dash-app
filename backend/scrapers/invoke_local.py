from scrape_content import handler

print(handler({
    'platform': 'instagram',
    'handle': 'yungmilly69',
    'task': 'get_profile_info',
    # 'content_to_process': '7151891791090814254',
    'use_tor': False,
}, {}))
