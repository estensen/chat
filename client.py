import socket
import sys
import json
import time
from threading import Thread

# Create TCP/IP socket
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Connect socket to the port where the server is listening
server_address = ('192.168.2.99', 80)
print >>sys.stderr, 'connecting to %s port %s' % server_address

emptyRequest = {'request': '', 'content': ''}

def read_socket():
    sock.connect(server_address)
    while True:
        data = sock.recv(10000)
        if len(data) is not 0:
            receivedDict = json.loads(data)
            if receivedDict['response'] == 'info' or receivedDict['response'] == 'error':
                print time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(receivedDict['timestamp']/1000)) + ' - ' + '/SERVER/: ' + receivedDict['content']
            if receivedDict['response'] == 'message':
                print time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(receivedDict['timestamp']/1000)) + ' - ' + receivedDict['sender'] + ': ' + receivedDict['content']
            if receivedDict['response'] == 'history':
                print time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(receivedDict['timestamp']/1000)) + ' - History:'
                for i, j in zip(receivedDict['content'][0::2], receivedDict['content'][1::2]):
                    print i + ': ' + j
