def main():
	#url = "https://www.monster.com/jobs/search/?q=Software-Developer&where=Seattle"
	#cd = "SearchResults,section,card-content"
	#ced = "[h2,div,div],[title,company,location]"
	url = sys.argv[1]
	cd = sys.argv[2]
	ced = sys.argv[3]
	results = webscrape(url,cd)
	objects, categories = parseContainer(results,ced)
	jsonCategories = json.dumps(categories)
	jsonObject = json.dumps(objects)
	print(jsonCategories)
	print(jsonObject)

if __name__ == "__main__":
    main()