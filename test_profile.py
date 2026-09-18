import urllib.request, json

def get_token():
    req = urllib.request.Request('http://localhost:8080/api/auth/login', data=json.dumps({'email': 'samirprajapat5@gmail.com', 'password': 'password'}).encode('utf-8'), headers={'Content-Type': 'application/json'})
    try:
        res = urllib.request.urlopen(req)
        data = json.loads(res.read().decode('utf-8'))
        return data['token'], data['userId']
    except Exception as e:
        print("Login failed", e)
        return None, None

token, user_id = get_token()
print("Token:", token)
if token:
    req = urllib.request.Request(f'http://localhost:8080/api/profile/{user_id}', data=json.dumps({'name':'Samir', 'email': 'samirprajapat5@gmail.com'}).encode('utf-8'), headers={'Authorization': 'Bearer ' + token, 'Content-Type':'application/json'}, method='PUT')
    try:
        res = urllib.request.urlopen(req)
        print("Success:", res.getcode(), res.read().decode('utf-8'))
    except Exception as e:
        print("Failed:", e.code if hasattr(e, 'code') else str(e), e.read().decode('utf-8') if hasattr(e, 'read') else '')
