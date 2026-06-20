import re
import urllib.request

url = 'https://www.kaggle.com/datasets/ambaliyagati/spotify-dataset-for-playing-around-with-sql'
print('Fetching', url)
text = urllib.request.urlopen(url, timeout=20).read().decode('utf-8', errors='ignore')
print('Length', len(text))
for pattern in [r'.{0,120}spotify_tracks\.csv.{0,120}', r"https?://[^\"'>\s]*spotify_tracks\.csv[^\"'>\s]*"]:
    print('--- pattern:', pattern)
    for match in re.finditer(pattern, text):
        print(match.group(0))
print('Done')
