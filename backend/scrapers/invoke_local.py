from scrape_content import handler

print(handler({
    'platform': 'instagram',
    'handle': 'yungmilly69',
    'task': 'full_run',
    # 'content_to_process': '7151891791090814254',
    'use_tor': False,
}, {}))
