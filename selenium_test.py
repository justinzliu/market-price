# Python program to demonstrate selenium 
  
  
from selenium import webdriver 
  
  
driver = webdriver.Chrome(executable_path="/home/testisteelnuts/Projects/Packages/webdrivers/chromedriver") 
driver.get("https://www.monster.com/jobs/search/?q=Software-Developer&where=Seattle") 