import re
with open("frontend/src/App.css", "r") as f:
    text = f.read()

text = text.replace(
"""  @media (max-width: 800px) {
    .header-login {
      display: none;
    }""",
"""  @media (max-width: 800px) {
    .header-login, .profile-link {
      display: none;
    }""")

with open("frontend/src/App.css", "w") as f:
    f.write(text)
