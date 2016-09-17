import socket
import sys
import json
import time
from threading import Thread

# Create TCP/IP socket
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Connect socket to the port where the server is listening
server_address = ('192.168.2.99', 1337)
empty_request = {'request': '', 'content': ''}

def read_socket():
    print('Connecting to %s port %s' % server_address)
    sock.connect(server_address)
    while True:
        data = sock.recv(10000)
        if len(data) is not 0:
            decoded_data = data.decode(encoding='utf-8')
            received_dict = json.loads(decoded_data)
            if received_dict['response'] == 'info' or received_dict['response'] == 'error':
                print(time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(received_dict['timestamp']/1000)) + ' - ' + '/SERVER/: ' + received_dict['content'])
            if received_dict['response'] == 'message':
                print(time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(received_dict['timestamp']/1000)) + ' - ' + received_dict['sender'] + ': ' + received_dict['content'])
            if received_dict['response'] == 'history':
                print(time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(received_dict['timestamp']/1000)) + ' - History:')
                for i, j in zip(received_dict['content'][0::2], received_dict['content'][1::2]):
                    print(i + ': ' + j)

def read_input():
    while True:
        data = input()
        if data[:5] == 'login':
            sock.send(process_login(data))
        elif data[:6] == 'logout':
            sock.send(process_logout(data))
        elif data[:7] == 'message':
            print(data)
            sock.send(process_message(data))
        elif data[:5] == 'names':
            sock.send(process_names(data))
        elif data[:4] == 'help':
            sock.send(process_help(data))
        else:
            data = 'help'
            sock.send(process_help(data))

def process_message(data):
    send_dict = {}

    if len(data.split(' ')) > 2:
        string_array = data.split(' ')
        send_dict['request'] = string_array[0]
        send_dict['content'] = ' '.join(string_array[1:])
        return json.dumps(send_dict)
    else:
        return json.dumps(empty_request)

try:
    read_socket()
    read_input()
finally:
    print(sys.stderr, 'Closing socket')
    sock.close()
