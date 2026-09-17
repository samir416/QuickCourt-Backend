const fs = require('fs');
const file = 'src/pages/Booking.jsx';
let content = fs.readFileSync(file, 'utf8');

// Add currentPage state
content = content.replace('const [error, setError] = useState(null);', 'const [error, setError] = useState(null);\n  const [currentPage, setCurrentPage] = useState(1);\n  const itemsPerPage = 9;');

// Reset page when filter changes
content = content.replace('const updateFilter = (name, value) =>\n    setFilters((current) => ({ ...current, [name]: value }));', 'const updateFilter = (name, value) => {\n    setFilters((current) => ({ ...current, [name]: value }));\n    setCurrentPage(1);\n  };');

// Replace map with paginatedVenues
content = content.replace('{visibleVenues.map((venue)', '{(visibleVenues.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)).map((venue)');

// Replace pagination block
const pagBlock = 
            {totalPages > 1 && (
            <nav className="pagination" aria-label="Venue pages">
              <button aria-label="Previous page" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>&lt;</button>
              {Array.from({length: totalPages}, (_, i) => i + 1).map(p => (
                <button key={p} className={currentPage === p ? "current-page" : ""} onClick={() => setCurrentPage(p)}>{p}</button>
              ))}
              <button aria-label="Next page" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>&gt;</button>
            </nav>
            )}
;

content = content.replace(/<nav className="pagination"[\s\S]*?<\/nav>/, 'const totalPages = Math.ceil(visibleVenues.length / itemsPerPage);\n' + pagBlock);

fs.writeFileSync(file, content);
