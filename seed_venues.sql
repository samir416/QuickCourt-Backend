USE quickcourt;
UPDATE users SET role = 'FACILITY_OWNER' WHERE id = 1;

INSERT INTO venues (name, description, address, city, state, approval_status, sports, starting_price, venue_type, rating, total_reviews, active, owner_id)
SELECT 'Ahmedabad Turf Arena', 'Premium artificial turf for 5v5 and 7v7 football.', 'SBR', 'Ahmedabad', 'Gujarat', 'APPROVED', 'Football', '800', 'Football', 4.8, 15, 1, 1 FROM DUAL WHERE NOT EXISTS (SELECT name FROM venues WHERE name = 'Ahmedabad Turf Arena');

INSERT INTO venues (name, description, address, city, state, approval_status, sports, starting_price, venue_type, rating, total_reviews, active, owner_id)
SELECT 'City Tennis Hub', 'Professional synthetic and clay tennis courts.', 'Navrangpura', 'Ahmedabad', 'Gujarat', 'APPROVED', 'Tennis', '500', 'Tennis', 4.5, 20, 1, 1 FROM DUAL WHERE NOT EXISTS (SELECT name FROM venues WHERE name = 'City Tennis Hub');

INSERT INTO venues (name, description, address, city, state, approval_status, sports, starting_price, venue_type, rating, total_reviews, active, owner_id)
SELECT 'QuickCourt Cricket Ground', 'Full size box cricket ground with floodlights.', 'Bopal', 'Ahmedabad', 'Gujarat', 'APPROVED', 'Cricket', '1200', 'Cricket', 4.9, 32, 1, 1 FROM DUAL WHERE NOT EXISTS (SELECT name FROM venues WHERE name = 'QuickCourt Cricket Ground');

INSERT INTO venues (name, description, address, city, state, approval_status, sports, starting_price, venue_type, rating, total_reviews, active, owner_id)
SELECT 'SBR Badminton Pro', 'Professional indoor wooden courts with AC.', 'Vaishnodevi', 'Ahmedabad', 'Gujarat', 'APPROVED', 'Badminton', '300', 'Badminton', 4.7, 45, 1, 1 FROM DUAL WHERE NOT EXISTS (SELECT name FROM venues WHERE name = 'SBR Badminton Pro');

INSERT INTO courts (name, sport, price_per_hour, active, venue_id, opening_time, closing_time) SELECT 'Turf 1', 'Football', 800, 1, id, '06:00', '23:00' FROM venues WHERE name = 'Ahmedabad Turf Arena' AND NOT EXISTS (SELECT name FROM courts WHERE name = 'Turf 1' AND venue_id = venues.id);
INSERT INTO courts (name, sport, price_per_hour, active, venue_id, opening_time, closing_time) SELECT 'Court A', 'Tennis', 500, 1, id, '06:00', '23:00' FROM venues WHERE name = 'City Tennis Hub' AND NOT EXISTS (SELECT name FROM courts WHERE name = 'Court A' AND venue_id = venues.id);
INSERT INTO courts (name, sport, price_per_hour, active, venue_id, opening_time, closing_time) SELECT 'Box 1', 'Cricket', 1200, 1, id, '06:00', '23:00' FROM venues WHERE name = 'QuickCourt Cricket Ground' AND NOT EXISTS (SELECT name FROM courts WHERE name = 'Box 1' AND venue_id = venues.id);
INSERT INTO courts (name, sport, price_per_hour, active, venue_id, opening_time, closing_time) SELECT 'Court 1', 'Badminton', 300, 1, id, '06:00', '23:00' FROM venues WHERE name = 'SBR Badminton Pro' AND NOT EXISTS (SELECT name FROM courts WHERE name = 'Court 1' AND venue_id = venues.id);

INSERT INTO time_slots (slot_date, start_time, end_time, status, court_id) SELECT CURDATE(), '18:00:00', '19:00:00', 'AVAILABLE', id FROM courts WHERE name IN ('Turf 1', 'Court A', 'Box 1', 'Court 1') AND NOT EXISTS (SELECT id FROM time_slots WHERE start_time = '18:00:00' AND court_id = courts.id AND slot_date = CURDATE());
INSERT INTO time_slots (slot_date, start_time, end_time, status, court_id) SELECT CURDATE(), '19:00:00', '20:00:00', 'AVAILABLE', id FROM courts WHERE name IN ('Turf 1', 'Court A', 'Box 1', 'Court 1') AND NOT EXISTS (SELECT id FROM time_slots WHERE start_time = '19:00:00' AND court_id = courts.id AND slot_date = CURDATE());
