import urllib.request, json

def get_token():
    req = urllib.request.Request('http://localhost:8080/api/auth/login', data=json.dumps({'email': 'samirprajapat5@gmail.com', 'password': 'password'}).encode('utf-8'), headers={'Content-Type': 'application/json'})
    try:
        res = urllib.request.urlopen(req)
        data = json.loads(res.read().decode('utf-8'))
        return data['token'], data['userId']
    except Exception as e:
        print("Login failed", getattr(e, 'code', str(e)), getattr(e, 'read', lambda: lambda: b'')().decode('utf-8'))
        return None, None

token, user_id = get_token()
print("Token:", token)
if token:
    req = urllib.request.Request(f'http://localhost:8080/api/bookings/user/{user_id}', headers={'Authorization': 'Bearer ' + token})
    try:
        res = urllib.request.urlopen(req)
        print("Success:", res.getcode(), res.read().decode('utf-8'))
    except Exception as e:
        print("Failed:", e.code if hasattr(e, 'code') else str(e), e.read().decode('utf-8') if hasattr(e, 'read') else '')
