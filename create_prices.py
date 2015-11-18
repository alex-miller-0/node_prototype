## CREATE PRICES
#########################################################################################################
# This is a cron job to generate a new set of prices for valid deals every time it is run (20 min or so).
#
# It will do the following:
# 	1) Delete old prices
#	2) Create a new set of prices. These will be overwritten in 20 minutes when the script is run again, 
#		but should be valid for a while in case the server goes down.
#	
#
def db_con(local):
	if local==1:
		return MySQLdb.connect(host='127.0.0.1', user='root', db='prototype') 
	else:
		return MySQLdb.connect(host='127.0.0.1', user=os.environ['MYSQL_USER'], passwd=os.environ['MYSQL_PASSWORD'], db='prototype', unix_socket='/tmp/mysql.sock')

import datetime
import MySQLdb
import os
import collections
import csv
import sys
import stripe
import random
from datetime import datetime
from dateutil.relativedelta import relativedelta
import time
def main():
	start = time.clock()
	create_prices()
	print str(time.clock()-start) + 's'

# Generate a series of prices and then write them to the database. One price_set is created per call to this function
# and it includes all deals that are applicable at the given time.
def create_prices():
	price_set = []
	ranges = get_ranges()

	con = db_con(local=True)
	#con = db_con(local=False)
	cur = con.cursor()

	# Open the connection and turn off autocommit
	cur.execute('SET autocommit=0;')
	
	#Define the price_set
	price_set_id = int(round(time.time(),0)) # price_set_id is the unix timestamp, rounded to the second
	time_start = datetime.now()
	time_end = datetime.now() + relativedelta(months=1) # make sure these are valid for a while in case the server goes down

	# 1) Create and insert the prices
	for r in ranges:
		price = make_price(r['min_price'], r['max_price'])
		q = """INSERT INTO price_sets (merchant_id, price, price_set_id, time_start, time_end) 
			VALUES ('%s', '%s', '%s', '%s', '%s')"""%(r['merchant_id'], price, price_set_id, time_start, time_end )
		cur.execute(q)
	
	# 2) Void other prices
	cur.execute('UPDATE price_sets SET void=1 WHERE price_set_id NOT LIKE %s'%price_set_id)

	# 3) Delete price_sets that are more than a month old
	q= "DELETE FROM price_sets WHERE time_start<'%s'"%((datetime.now()-relativedelta(months=1)).date())
	cur.execute(q)


	# Commit all inserts at once and close the connection
	con.commit()
	con.close()

def make_price(min, max):
	return random.randint(min, max)

# Query the appropriate deal objects; these will be valid on the current day and at the current time
def get_ranges():
	ranges = 'SELECT min_price, max_price, merchant_id FROM deals'
	return [dict(zip(['min_price', 'max_price', 'merchant_id'],row)) for row in execute_query(ranges)]

def execute_query(query):
	connection = db_con(local=True)
	#connection = db_con(local=False)


	cursor = connection.cursor()
	cursor.execute(query)
	data = cursor.fetchall()
	cursor.close()
	connection.commit()
	connection.close()
	return data

if __name__=="__main__":
    main()

