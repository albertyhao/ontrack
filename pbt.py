import sys
from newspaper import Article

url = sys.argv[1]

article = Article(url)
article.download()
article.parse()
article.nlp()

print(article.keywords)

