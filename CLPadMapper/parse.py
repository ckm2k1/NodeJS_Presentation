#! /usr/bin/env python

from bs4 import BeautifulSoup as bs
import urllib as li
import codecs as cd
import re
import urlparse as up
import eventlet
from eventlet.green import urllib2

baseUrl = 'http://montreal.en.craigslist.ca/apa/'

data_file = cd.open("cl.txt", "w", "utf-8")

bh = bs(li.urlopen(baseUrl))
ps = bh.find_all('p')

urls = []


for p in ps:
    link = p.find('a')
    linkText = link.string
    # if (re.compile('/$[0-9]+/').search(linkText)):
    href = link.get('href')
    if (re.compile(r"index100").search(href)):
        break
    else:
        urls.append(link.get('href'))


def fetch(url):
    print "opening", url
    body = urllib2.urlopen(url).read()
    print "done with", url
    return url, body

adsLinkSet = set()
tmpData = []

pool = eventlet.GreenPool(200)
for url, body in pool.imap(fetch, urls):
    tmpData.append(body)


for listing in tmpData:
    cur = bs(listing)
    gmapsLinkElem = cur.find('small')
    if gmapsLinkElem:
        gmapsLink = gmapsLinkElem.find_all('a')[0]
        adsLinkSet.add(gmapsLink.get('href'))


for coord in adsLinkSet:
    coord = str(coord)
    qs = up.urlparse(coord).query
    decodedAddress = dict(up.parse_qsl(qs))
    decodedAddress = decodedAddress['q'].decode('utf-8').split(':')[1].strip()
    data_file.write(",\"%s\"\n" % (decodedAddress))

data_file.close()


def main():
    pass

if __name__ == '__main__':
    main()
