-- 1. Update missing amenities for existing venues 1-6
UPDATE venues SET amenities = 'Parking, Washroom, Drinking Water, Changing Room, First Aid, Pro Shop, AC' WHERE id = 1 AND (amenities IS NULL OR amenities = '');
UPDATE venues SET amenities = 'Parking, Washroom, Drinking Water, Lockers, Seating' WHERE id = 2 AND (amenities IS NULL OR amenities = '');
UPDATE venues SET amenities = 'Parking, Washroom, Floodlights, Seating, Cafe, First Aid' WHERE id = 3 AND (amenities IS NULL OR amenities = '');
UPDATE venues SET amenities = 'Parking, Washroom, Pro Shop, Changing Room, Floodlights' WHERE id = 4 AND (amenities IS NULL OR amenities = '');
UPDATE venues SET amenities = 'Parking, Washroom, Floodlights, Cafe, Seating, Lockers' WHERE id = 5 AND (amenities IS NULL OR amenities = '');
UPDATE venues SET amenities = 'Parking, Washroom, Pro Shop, Changing Room, Seating' WHERE id = 6 AND (amenities IS NULL OR amenities = '');

-- 2. Insert active courts for venues that have no courts
-- SBR Badminton (id: 1)
INSERT INTO courts (name, sport, price_per_hour, opening_time, closing_time, active, venue_id, created_at, updated_at)
SELECT 'Court 1 (Wooden)', 'Badminton', 250.0, '06:00', '23:00', 1, 1, NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM courts WHERE venue_id = 1 AND name = 'Court 1 (Wooden)');

INSERT INTO courts (name, sport, price_per_hour, opening_time, closing_time, active, venue_id, created_at, updated_at)
SELECT 'Court 2 (Synthetic)', 'Badminton', 300.0, '06:00', '23:00', 1, 1, NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM courts WHERE venue_id = 1 AND name = 'Court 2 (Synthetic)');

-- Skyline Badminton Court (id: 2)
INSERT INTO courts (name, sport, price_per_hour, opening_time, closing_time, active, venue_id, created_at, updated_at)
SELECT 'Court A', 'Badminton', 300.0, '06:00', '23:00', 1, 2, NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM courts WHERE venue_id = 2);

-- The Turf House (id: 3)
INSERT INTO courts (name, sport, price_per_hour, opening_time, closing_time, active, venue_id, created_at, updated_at)
SELECT 'Pitch 1', 'Football', 600.0, '06:00', '23:00', 1, 3, NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM courts WHERE venue_id = 3);

-- Ace Tennis Club (id: 4)
INSERT INTO courts (name, sport, price_per_hour, opening_time, closing_time, active, venue_id, created_at, updated_at)
SELECT 'Center Court', 'Tennis', 450.0, '06:00', '23:00', 1, 4, NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM courts WHERE venue_id = 4);

-- Elite Sports Complex (id: 10)
INSERT INTO courts (name, sport, price_per_hour, opening_time, closing_time, active, venue_id, created_at, updated_at)
SELECT 'Arena 1', 'Badminton', 600.0, '06:00', '23:00', 1, 10, NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM courts WHERE venue_id = 10);

-- Greenwood Tennis Academy (id: 11)
INSERT INTO courts (name, sport, price_per_hour, opening_time, closing_time, active, venue_id, created_at, updated_at)
SELECT 'Court 1 (Clay)', 'Tennis', 800.0, '06:00', '23:00', 1, 11, NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM courts WHERE venue_id = 11);

-- Smashers Hub (id: 12)
INSERT INTO courts (name, sport, price_per_hour, opening_time, closing_time, active, venue_id, created_at, updated_at)
SELECT 'Court 1', 'Badminton', 500.0, '06:00', '23:00', 1, 12, NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM courts WHERE venue_id = 12);

-- Sunrise Cricket Grounds (id: 13)
INSERT INTO courts (name, sport, price_per_hour, opening_time, closing_time, active, venue_id, created_at, updated_at)
SELECT 'Main Ground', 'Cricket', 1500.0, '06:00', '23:00', 1, 13, NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM courts WHERE venue_id = 13);

-- Urban Football Arena (id: 14)
INSERT INTO courts (name, sport, price_per_hour, opening_time, closing_time, active, venue_id, created_at, updated_at)
SELECT 'Turf A', 'Football', 1200.0, '06:00', '23:00', 1, 14, NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM courts WHERE venue_id = 14);

-- Victory Swimming Center (id: 15)
INSERT INTO courts (name, sport, price_per_hour, opening_time, closing_time, active, venue_id, created_at, updated_at)
SELECT 'Lane 1-4', 'Swimming', 400.0, '06:00', '23:00', 1, 15, NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM courts WHERE venue_id = 15);

-- 3. Insert real venue photos for venues
-- SBR Badminton (id: 1)
INSERT INTO venue_photos (venue_id, image_url, caption, created_at)
SELECT 1, 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=85', 'SBR Badminton Main Court', NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM venue_photos WHERE venue_id = 1 AND image_url LIKE '%photo-1626224583764%');

INSERT INTO venue_photos (venue_id, image_url, caption, created_at)
SELECT 1, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=85', 'Synthetic Court Side View', NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM venue_photos WHERE venue_id = 1 AND image_url LIKE '%photo-1546519638%');

INSERT INTO venue_photos (venue_id, image_url, caption, created_at)
SELECT 1, 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=800&q=85', 'Warmup Area & Equipment', NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM venue_photos WHERE venue_id = 1 AND image_url LIKE '%photo-1526232761%');

-- Skyline Badminton Court (id: 2)
INSERT INTO venue_photos (venue_id, image_url, caption, created_at)
SELECT 2, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=85', 'Skyline Badminton Court View', NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM venue_photos WHERE venue_id = 2);

-- The Turf House (id: 3)
INSERT INTO venue_photos (venue_id, image_url, caption, created_at)
SELECT 3, 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1200&q=85', 'The Turf House Arena', NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM venue_photos WHERE venue_id = 3);

-- Ace Tennis Club (id: 4)
INSERT INTO venue_photos (venue_id, image_url, caption, created_at)
SELECT 4, 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=85', 'Ace Tennis Club Courts', NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM venue_photos WHERE venue_id = 4);

-- Ahmedabad Turf Arena (id: 5)
INSERT INTO venue_photos (venue_id, image_url, caption, created_at)
SELECT 5, 'https://images.unsplash.com/photo-1611251135345-18c56206b863?auto=format&fit=crop&w=1200&q=85', 'Ahmedabad Turf Arena', NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM venue_photos WHERE venue_id = 5);

-- City Tennis Hub (id: 6)
INSERT INTO venue_photos (venue_id, image_url, caption, created_at)
SELECT 6, 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=1200&q=85', 'City Tennis Hub', NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM venue_photos WHERE venue_id = 6);

-- Elite Sports Complex (id: 10)
INSERT INTO venue_photos (venue_id, image_url, caption, created_at)
SELECT 10, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85', 'Elite Sports Complex', NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM venue_photos WHERE venue_id = 10);

-- Greenwood Tennis Academy (id: 11)
INSERT INTO venue_photos (venue_id, image_url, caption, created_at)
SELECT 11, 'https://images.unsplash.com/photo-1599586120429-48281b6f0ece?auto=format&fit=crop&w=1200&q=85', 'Greenwood Tennis Academy', NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM venue_photos WHERE venue_id = 11);

-- Smashers Hub (id: 12)
INSERT INTO venue_photos (venue_id, image_url, caption, created_at)
SELECT 12, 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=85', 'Smashers Hub', NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM venue_photos WHERE venue_id = 12);

-- Sunrise Cricket Grounds (id: 13)
INSERT INTO venue_photos (venue_id, image_url, caption, created_at)
SELECT 13, 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=85', 'Sunrise Cricket Ground', NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM venue_photos WHERE venue_id = 13);

-- Urban Football Arena (id: 14)
INSERT INTO venue_photos (venue_id, image_url, caption, created_at)
SELECT 14, 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=85', 'Urban Football Arena', NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM venue_photos WHERE venue_id = 14);

-- Victory Swimming Center (id: 15)
INSERT INTO venue_photos (venue_id, image_url, caption, created_at)
SELECT 15, 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=1200&q=85', 'Victory Swimming Pool', NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM venue_photos WHERE venue_id = 15);
