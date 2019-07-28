from newspaper import Article
url = 'https://supernatural.fandom.com/wiki/Supernatural_Wiki'

article = Article(url)

article.download()

print(article.html)