const fs = require('fs');
const file = 'src/pages/CourtDetail.jsx';
let content = fs.readFileSync(file, 'utf8');

// Add reviews state
if (!content.includes('const [reviews, setReviews]')) {
    content = content.replace('const [error, setError] = useState("");', 'const [error, setError] = useState("");\n    const [reviews, setReviews] = useState([]);');
    
    // Update fetchVenue to fetch reviews
    content = content.replace('const data = await apiFetch("/venues/" + venueId);', 'const data = await apiFetch("/venues/" + venueId);\n          const reviewsData = await apiFetch("/venues/" + venueId + "/reviews").catch(() => []);\n          setReviews(Array.isArray(reviewsData) ? reviewsData : []);');
    
    // Replace fake review with mapping
    const fakeReviewRegex = /<ReviewItem[\s\S]*?rating=\{5\}\s*\/>/;
    const mapping = 
              {reviews.length > 0 ? reviews.map(r => (
                <ReviewItem key={r.id} name={r.playerName || 'Player'} date={new Date().toLocaleDateString()} text={r.comment} rating={r.rating} />
              )) : <p>No reviews yet.</p>}
    ;
    content = content.replace(fakeReviewRegex, mapping.trim());
    
    // Fix hardcoded INR 200
    content = content.replace('<strong>Starting from INR 200</strong>', '<strong>Starting from INR {venue.startingPrice}</strong>');
    
    fs.writeFileSync(file, content);
}
