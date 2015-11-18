import multiprocessing as mp
import random
import string
import requests
import json
import urllib2
import timeit
import os

# set current process
n = 1000
start = timeit.default_timer()
def GET():
	try:
	   	sql_data = json.dumps({"sql":1, "region":1})
	   	mongo_data = json.dumps({"sql":0, "region":1})
		es_data = json.dumps({
			"type" : "deal",
			"data" : {
    			"sub_type" : "search",
    			"date_time": "2013-10-27T19:00:00",
    			"iso_time": "2013-10-27T19:00:00+00:00",
    			"distance": 2,
    			"location": {
      				"lat": "30.2794888",
      				"lon": "-97.742511"
    			},
    			"price": "5",
    			"search_query": "Italian",
    			"user_id": "1"
  			}
		})

		headers={'content-type' : 'application/json'}
		
		
		# Prototype system

		# New dev server (only running prototype)
		url = os.environ['DEV_HOST']
		
		# SQL Tests
		connection_timeout=0.1
		read_timeout=5.0
		#r = requests.post(url, data=sql_data, headers=headers, timeout=(connection_timeout,read_timeout) )
		r = requests.get(url, headers=headers)
		
		# Mongo tests
		#print url, mongo_data
		#r = requests.post(url, data=mongo_data, headers=headers)

		content = json.loads(r.content)

	except Exception,e: 
		print 'Error: ' + str(e)
		
# Setup a list of processes that we want to run
processes = [mp.Process(target=GET) for x in range(n)]

# Run processes
for p in processes:
    p.start()

# Exit the completed processes
for p in processes:
    p.join()


# Print stats
print 'Made '+ str(n) + ' connections in '+ str(timeit.default_timer() - start) + 's '


