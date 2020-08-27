import sys 
import requests
import json
from bs4 import BeautifulSoup #install python-beautifulsoup


#grab all elements in container holding desired list
def webscrape(URL, string):
	pstring = processCD(string)
	page = requests.get(URL)
	soup = BeautifulSoup(page.content, 'html.parser')
	results = soup.find(id=pstring[0])
	results = results.find_all(pstring[1], class_=pstring[2])
	return results

#process html into dictionary, strip all useless html details 
def parseContainer(containerList, string):
	pstring = processCED(string)
	lst = []
	for elem in containerList:
		obj = {}
		for i, cat in enumerate(pstring[1]):
			item = elem.find(pstring[0][i],class_=cat)
			if item == None: continue;
			item = (elem.find(pstring[0][i],class_=cat)).text
			obj[cat] = item.strip()
		if obj:
			lst.append(obj.copy())
	return lst, {"categories": pstring[1]}

#process container details
def processCD(string):
	pstring = string.split(",")
	return pstring

#process container entry details
def processCED(string):
	pstring = string.split("],[")
	for i, elem in enumerate(pstring):
		pstring[i] = elem.replace("[","").replace("]","")
		pstring[i] = pstring[i].split(",")
	return pstring

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