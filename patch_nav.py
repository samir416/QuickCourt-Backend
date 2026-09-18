with open('frontend/src/pages/Navbar.jsx', 'r') as f:
    text = f.read()

text = text.replace(
"""      </div>
      <button
        className="mobile-menu-toggle\"""", 
"""        <button
          className="mobile-menu-toggle\"""")

text = text.replace(
"""      >
        {menuOpen ? "X" : "Menu"}
      </button>
    </header>""",
"""      >
          {menuOpen ? "X" : "Menu"}
        </button>
      </div>
    </header>""")

with open('frontend/src/pages/Navbar.jsx', 'w') as f:
    f.write(text)
