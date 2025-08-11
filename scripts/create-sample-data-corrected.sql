-- Sample Data for Pilzno Synagogue Management System
-- This script creates realistic families and members with various life events

-- First, let's create some family tiers
INSERT INTO family_tiers (id, name, description, "minimumDonation", benefits, "priorityLevel", "isActive", "createdAt", "updatedAt") VALUES
('tier-1', 'Founding Family', 'Original founding members of the synagogue', 10000, 'Priority seating, special recognition, voting rights', 1, true, NOW(), NOW()),
('tier-2', 'Life Members', 'Long-term committed members', 5000, 'Reserved seating, newsletter priority', 2, true, NOW(), NOW()),
('tier-3', 'Young Professional', 'New families starting their journey', 2000, 'Welcome package, mentorship opportunities', 3, true, NOW(), NOW()),
('tier-4', 'Student', 'University students and young adults', 500, 'Student events, learning opportunities', 4, true, NOW(), NOW());

-- Create sample families
INSERT INTO families (id, "familyName", "hebrewFamilyName", "primaryEmail", "secondaryEmail", phone, "emergencyContact", address, city, state, "zipCode", country, "membershipStatus", "membershipStartDate", "annualPledge", "totalDonations", "familyHealth", "isFoundingFamily", "isBoardFamily", "familyTierId", "createdAt", "updatedAt") VALUES
('family-1', 'Cohen Family', 'משפחת כהן', 'cohen@pilzno.org', 'sarah.cohen@email.com', '+972-50-123-4567', '+972-50-123-4568', '123 Herzl Street', 'Tel Aviv', 'Tel Aviv', '6123456', 'Israel', 'member', '2020-01-15', 8000, 15000, 'excellent', true, true, 'tier-1', NOW(), NOW()),
('family-2', 'Goldberg Family', 'משפחת גולדברג', 'goldberg@pilzno.org', 'david.goldberg@email.com', '+972-50-234-5678', '+972-50-234-5679', '456 Rothschild Boulevard', 'Tel Aviv', 'Tel Aviv', '6123457', 'Israel', 'member', '2021-03-20', 6000, 12000, 'good', false, false, 'tier-2', NOW(), NOW()),
('family-3', 'Levy Family', 'משפחת לוי', 'levy@pilzno.org', 'rachel.levy@email.com', '+972-50-345-6789', '+972-50-345-6790', '789 Dizengoff Street', 'Tel Aviv', 'Tel Aviv', '6123458', 'Israel', 'member', '2022-06-10', 4000, 8000, 'good', false, false, 'tier-2', NOW(), NOW()),
('family-4', 'Rosen Family', 'משפחת רוזן', 'rosen@pilzno.org', 'michael.rosen@email.com', '+972-50-456-7890', '+972-50-456-7891', '321 Allenby Street', 'Tel Aviv', 'Tel Aviv', '6123459', 'Israel', 'prospective', '2023-09-01', 3000, 3000, 'needs-attention', false, false, 'tier-3', NOW(), NOW()),
('family-5', 'Weiss Family', 'משפחת וייס', 'weiss@pilzno.org', 'jennifer.weiss@email.com', '+972-50-567-8901', '+972-50-567-8902', '654 Ben Yehuda Street', 'Tel Aviv', 'Tel Aviv', '6123460', 'Israel', 'member', '2021-11-15', 5000, 10000, 'excellent', false, true, 'tier-2', NOW(), NOW());

-- Create family members with various life events and statuses
INSERT INTO family_members (id, "firstName", "lastName", "hebrewFirstName", "hebrewLastName", nickname, email, phone, "dateOfBirth", "hebrewBirthDate", gender, "relationshipToHead", "isActive", "isPrimaryContact", "barBatMitzvahDate", "hebrewBarBatMitzvahDate", "isCohen", "isLevi", "israeliCitizenship", "aliyahDate", education, profession, "synagogueRoles", skills, interests, "dateOfDeath", "hebrewDeathDate", "memorialInstructions", "receiveEmails", "receiveTexts", "emergencyContact", "medicalNotes", "accessibilityNeeds", notes, "familyId", "createdAt", "updatedAt") VALUES
-- Cohen Family Members
('member-1', 'David', 'Cohen', 'דוד', 'כהן', 'Dave', 'david.cohen@pilzno.org', '+972-50-123-4567', '1975-05-15', 'כ"ה אייר תשל"ה', 'male', 'self', true, true, '1988-05-15', 'כ"ה אייר תשמ"ח', true, false, true, '1995-08-20', 'PhD in Jewish Studies, Hebrew University', 'Rabbi and Educator', 'Head Rabbi, Board Member', 'Torah study, teaching, counseling', 'Jewish education, community building', NULL, NULL, NULL, true, false, true, NULL, NULL, 'Head of household, primary contact for family matters', 'family-1', NOW(), NOW()),
('member-2', 'Sarah', 'Cohen', 'שרה', 'כהן', 'Sari', 'sarah.cohen@pilzno.org', '+972-50-123-4568', '1978-08-22', 'י"ט אלול תשל"ח', 'female', 'spouse', true, false, '1991-08-22', 'י"ט אלול תשנ"א', false, false, true, '1996-03-15', 'MA in Social Work, Tel Aviv University', 'Social Worker', 'Women''s Group Leader', 'Community organizing, counseling', 'Social justice, women''s empowerment', NULL, NULL, NULL, true, true, false, NULL, NULL, 'Active in women''s programming and community outreach', 'family-1', NOW(), NOW()),
('member-3', 'Ethan', 'Cohen', 'איתן', 'כהן', 'E', 'ethan.cohen@pilzno.org', '+972-50-123-4569', '2005-12-10', 'ח"י כסלו תשס"ו', 'male', 'child', true, false, '2018-12-10', 'ח"י כסלו תשע"ט', true, false, true, '2005-12-10', 'High School Student', 'Student', 'Youth Group Member', 'Basketball, music, Torah study', 'Sports, music, Jewish learning', NULL, NULL, NULL, true, true, false, NULL, NULL, 'Eldest child, active in youth programs', 'family-1', NOW(), NOW()),
('member-4', 'Maya', 'Cohen', 'מאיה', 'כהן', 'M', 'maya.cohen@pilzno.org', '+972-50-123-4570', '2008-03-18', 'י"א ניסן תשס"ח', 'female', 'child', true, false, '2021-03-18', 'י"א ניסן תשפ"א', false, false, true, '2008-03-18', 'Middle School Student', 'Student', 'Children''s Choir Member', 'Singing, art, dance', 'Arts, music, Jewish culture', NULL, NULL, NULL, true, false, false, NULL, NULL, 'Youngest child, loves music and arts', 'family-1', NOW(), NOW()),

-- Goldberg Family Members
('member-5', 'Michael', 'Goldberg', 'מיכאל', 'גולדברג', 'Mike', 'michael.goldberg@pilzno.org', '+972-50-234-5678', '1980-02-14', 'כ"ח שבט תש"מ', 'male', 'self', true, true, '1993-02-14', 'כ"ח שבט תשנ"ג', false, false, true, '2000-06-10', 'MBA, Tel Aviv University', 'Business Consultant', 'Finance Committee Member', 'Financial planning, strategic thinking', 'Business, finance, community development', NULL, NULL, NULL, true, true, true, NULL, NULL, 'Family financial planner and community volunteer', 'family-2', NOW(), NOW()),
('member-6', 'Rachel', 'Goldberg', 'רחל', 'גולדברג', 'Rach', 'rachel.goldberg@pilzno.org', '+972-50-234-5679', '1982-07-30', 'ט"ו אב תשמ"ב', 'female', 'spouse', true, false, '1995-07-30', 'ט"ו אב תשנ"ה', false, false, true, '2001-09-05', 'MA in Education, Bar-Ilan University', 'Elementary School Teacher', 'Education Committee Chair', 'Teaching, curriculum development', 'Education, children''s literature', NULL, NULL, NULL, true, false, false, NULL, NULL, 'Educational leader and children''s program coordinator', 'family-2', NOW(), NOW()),
('member-7', 'Daniel', 'Goldberg', 'דניאל', 'גולדברג', 'Dan', 'daniel.goldberg@pilzno.org', '+972-50-234-5680', '2010-11-25', 'י"ח כסלו תשע"א', 'male', 'child', true, false, '2023-11-25', 'י"ח כסלו תשפ"ד', false, false, true, '2010-11-25', 'Elementary School Student', 'Student', 'Children''s Program Participant', 'Soccer, reading, Hebrew', 'Sports, learning, Jewish culture', NULL, NULL, NULL, true, false, false, NULL, NULL, 'Young child, learning Hebrew and Jewish traditions', 'family-2', NOW(), NOW()),

-- Levy Family Members
('member-8', 'Jonathan', 'Levy', 'יונתן', 'לוי', 'Jon', 'jonathan.levy@pilzno.org', '+972-50-345-6789', '1977-04-12', 'כ"ד ניסן תשל"ז', 'male', 'self', true, true, '1990-04-12', 'כ"ד ניסן תש"ן', false, true, true, '1998-12-01', 'MD, Ben-Gurion University', 'Cardiologist', 'Health Committee Member', 'Medical expertise, patient care', 'Healthcare, medical research, community health', NULL, NULL, NULL, true, true, true, NULL, NULL, 'Medical professional and community health advocate', 'family-3', NOW(), NOW()),
('member-9', 'Miriam', 'Levy', 'מרים', 'לוי', 'Miri', 'miriam.levy@pilzno.org', '+972-50-345-6790', '1979-10-08', 'י"ז תשרי תשל"ט', 'female', 'spouse', true, false, '1992-10-08', 'י"ז תשרי תשנ"ב', false, false, true, '1999-05-20', 'PhD in Psychology, Hebrew University', 'Clinical Psychologist', 'Mental Health Support Group Leader', 'Therapy, counseling, research', 'Mental health, family therapy, research', NULL, NULL, NULL, true, false, false, NULL, NULL, 'Mental health professional and support group facilitator', 'family-3', NOW(), NOW()),
('member-10', 'Ari', 'Levy', 'ארי', 'לוי', 'A', 'ari.levy@pilzno.org', '+972-50-345-6791', '2012-06-15', 'כ"ו סיון תשע"ב', 'male', 'child', true, false, '2025-06-15', 'כ"ו סיון תשפ"ה', false, true, true, '2012-06-15', 'Elementary School Student', 'Student', 'Children''s Program Participant', 'Swimming, chess, Torah study', 'Water sports, strategy games, Jewish learning', NULL, NULL, NULL, true, false, false, NULL, NULL, 'Young child, preparing for Bar Mitzvah', 'family-3', NOW(), NOW()),

-- Rosen Family Members (Prospective)
('member-11', 'Alexander', 'Rosen', 'אלכסנדר', 'רוזן', 'Alex', 'alexander.rosen@pilzno.org', '+972-50-456-7890', '1985-01-20', 'כ"ח טבת תשמ"ה', 'male', 'self', true, true, '1998-01-20', 'כ"ח טבת תשנ"ח', false, false, false, NULL, 'MA in International Relations, IDC Herzliya', 'Diplomat', 'New Member', 'International relations, languages, diplomacy', 'Global affairs, cultural exchange, Jewish identity', NULL, NULL, NULL, true, true, true, NULL, NULL, 'New to community, exploring Jewish heritage', 'family-4', NOW(), NOW()),
('member-12', 'Sophia', 'Rosen', 'סופיה', 'רוזן', 'Soph', 'sophia.rosen@pilzno.org', '+972-50-456-7891', '1987-09-14', 'כ"א אלול תשמ"ז', 'female', 'spouse', true, false, '2000-09-14', 'כ"א אלול תש"ס', false, false, false, NULL, 'BA in Art History, Tel Aviv University', 'Art Gallery Curator', 'New Member', 'Art curation, cultural events, design', 'Art, culture, Jewish art history', NULL, NULL, NULL, true, false, false, NULL, NULL, 'Art professional, interested in Jewish cultural heritage', 'family-4', NOW(), NOW()),

-- Weiss Family Members
('member-13', 'Benjamin', 'Weiss', 'בנימין', 'וייס', 'Ben', 'benjamin.weiss@pilzno.org', '+972-50-567-8901', '1973-12-03', 'כ"ח כסלו תשל"ד', 'male', 'self', true, true, '1986-12-03', 'כ"ח כסלו תשמ"ו', false, false, true, '1997-04-15', 'PhD in Computer Science, Technion', 'Software Engineer', 'Technology Committee Chair', 'Software development, system architecture', 'Technology, innovation, Jewish tech community', NULL, NULL, NULL, true, true, true, NULL, NULL, 'Technology leader and community innovator', 'family-5', NOW(), NOW()),
('member-14', 'Jennifer', 'Weiss', 'ג''ניפר', 'וייס', 'Jen', 'jennifer.weiss@pilzno.org', '+972-50-567-8902', '1975-03-25', 'י"ג ניסן תשל"ה', 'female', 'spouse', true, false, '1988-03-25', 'י"ג ניסן תשמ"ח', false, false, true, '1998-07-10', 'MA in Jewish Education, Jewish Theological Seminary', 'Jewish Educator', 'Education Director', 'Jewish education, curriculum development', 'Jewish learning, family education, community building', NULL, NULL, NULL, true, false, false, NULL, NULL, 'Educational director and family program coordinator', 'family-5', NOW(), NOW()),
('member-15', 'Emma', 'Weiss', 'אמה', 'וייס', 'E', 'emma.weiss@pilzno.org', '+972-50-567-8903', '2007-08-12', 'כ"ח אב תשס"ז', 'female', 'child', true, false, '2020-08-12', 'כ"ח אב תש"פ', false, false, true, '2007-08-12', 'High School Student', 'Student', 'Teen Group Leader', 'Drama, music, leadership', 'Performing arts, youth leadership, Jewish identity', NULL, NULL, NULL, true, true, false, NULL, NULL, 'Teen leader and performing arts enthusiast', 'family-5', NOW(), NOW());

-- Create some life events to track family changes
INSERT INTO events (id, title, description, "eventType", "dueDate", "hebrewDate", location, status, "recurrencePattern", "familyId", "familyMemberId", "createdAt", "updatedAt") VALUES
-- Birth events
('event-1', 'Birth of Maya Cohen', 'Maya Cohen was born to David and Sarah Cohen', 'birth', '2008-03-18', 'י"א ניסן תשס"ח', 'Tel Aviv Medical Center', 'completed', NULL, 'family-1', 'member-4', NOW(), NOW()),
('event-2', 'Birth of Daniel Goldberg', 'Daniel Goldberg was born to Michael and Rachel Goldberg', 'birth', '2010-11-25', 'י"ח כסלו תשע"א', 'Tel Aviv Medical Center', 'completed', NULL, 'family-2', 'member-7', NOW(), NOW()),
('event-3', 'Birth of Ari Levy', 'Ari Levy was born to Jonathan and Miriam Levy', 'birth', '2012-06-15', 'כ"ו סיון תשע"ב', 'Tel Aviv Medical Center', 'completed', NULL, 'family-3', 'member-10', NOW(), NOW()),

-- Bar/Bat Mitzvah events
('event-4', 'Bar Mitzvah of Ethan Cohen', 'Ethan Cohen celebrated his Bar Mitzvah', 'bar_mitzvah', '2018-12-10', 'ח"י כסלו תשע"ט', 'Pilzno Synagogue', 'completed', NULL, 'family-1', 'member-3', NOW(), NOW()),
('event-5', 'Bat Mitzvah of Maya Cohen', 'Maya Cohen celebrated her Bat Mitzvah', 'bar_mitzvah', '2021-03-18', 'י"א ניסן תשפ"א', 'Pilzno Synagogue', 'completed', NULL, 'family-1', 'member-4', NOW(), NOW()),
('event-6', 'Bar Mitzvah of Daniel Goldberg', 'Daniel Goldberg celebrated his Bar Mitzvah', 'bar_mitzvah', '2023-11-25', 'י"ח כסלו תשפ"ד', 'Pilzno Synagogue', 'completed', NULL, 'family-2', 'member-7', NOW(), NOW()),

-- Upcoming events
('event-7', 'Bar Mitzvah of Ari Levy', 'Ari Levy will celebrate his Bar Mitzvah', 'bar_mitzvah', '2025-06-15', 'כ"ו סיון תשפ"ה', 'Pilzno Synagogue', 'upcoming', NULL, 'family-3', 'member-10', NOW(), NOW()),

-- Wedding events
('event-8', 'Wedding of David and Sarah Cohen', 'David and Sarah Cohen were married', 'wedding', '2000-06-15', 'י"ב סיון תש"ס', 'Pilzno Synagogue', 'completed', NULL, 'family-1', NULL, NOW(), NOW()),
('event-9', 'Wedding of Michael and Rachel Goldberg', 'Michael and Rachel Goldberg were married', 'wedding', '2005-09-20', 'ט"ז תשרי תשס"ו', 'Pilzno Synagogue', 'completed', NULL, 'family-2', NULL, NOW(), NOW()),
('event-10', 'Wedding of Jonathan and Miriam Levy', 'Jonathan and Miriam Levy were married', 'wedding', '2003-12-10', 'ט"ז כסלו תשס"ד', 'Pilzno Synagogue', 'completed', NULL, 'family-3', NULL, NOW(), NOW()),

-- Community events
('event-11', 'Annual Community Dinner', 'Annual community dinner and fundraiser', 'community', '2024-12-15', 'י"ג כסלו תשפ"ה', 'Pilzno Synagogue Community Hall', 'upcoming', 'yearly', NULL, NULL, NOW(), NOW()),
('event-12', 'Chanukah Celebration', 'Community Chanukah celebration and menorah lighting', 'holiday', '2024-12-25', 'כ"ג כסלו תשפ"ה', 'Pilzno Synagogue', 'upcoming', 'yearly', NULL, NULL, NOW(), NOW());

-- Create some donations to show financial tracking
INSERT INTO donations (id, amount, "donationDate", "paymentMethod", "donationType", "recurringFrequency", "fundName", "isAnonymous", "receiptSent", "familyId", "familyMemberId", "createdAt", "updatedAt") VALUES
('donation-1', 5000, '2024-01-15', 'bank_transfer', 'general', 'annual', 'General Fund', false, true, 'family-1', 'member-1', NOW(), NOW()),
('donation-2', 3000, '2024-02-20', 'credit_card', 'building', 'one_time', 'Building Fund', false, true, 'family-1', 'member-1', NOW(), NOW()),
('donation-3', 4000, '2024-01-20', 'bank_transfer', 'general', 'annual', 'General Fund', false, true, 'family-2', 'member-5', NOW(), NOW()),
('donation-4', 2500, '2024-02-15', 'check', 'torah', 'one_time', 'Torah Fund', false, true, 'family-2', 'member-5', NOW(), NOW()),
('donation-5', 3000, '2024-01-25', 'bank_transfer', 'general', 'annual', 'General Fund', false, true, 'family-3', 'member-8', NOW(), NOW()),
('donation-6', 2000, '2024-03-01', 'credit_card', 'memorial', 'one_time', 'Memorial Fund', false, true, 'family-3', 'member-8', NOW(), NOW()),
('donation-7', 1500, '2024-01-30', 'bank_transfer', 'general', 'annual', 'General Fund', false, true, 'family-4', 'member-11', NOW(), NOW()),
('donation-8', 3500, '2024-02-10', 'bank_transfer', 'general', 'annual', 'General Fund', false, true, 'family-5', 'member-13', NOW(), NOW());

-- Create some notes to show family tracking
INSERT INTO notes (id, title, content, "noteType", "familyId", "familyMemberId", "createdAt", "updatedAt") VALUES
('note-1', 'Family Health Check', 'Cohen family is doing well. David is recovering from minor surgery. Children are thriving in school and community programs.', 'family_health', 'family-1', NULL, NOW(), NOW()),
('note-2', 'New Member Welcome', 'Goldberg family joined in 2021. Very active in community programs. Michael serves on finance committee.', 'membership', 'family-2', NULL, NOW(), NOW()),
('note-3', 'Medical Update', 'Jonathan Levy had successful heart surgery. Family is grateful for community support during recovery.', 'medical', 'family-3', 'member-8', NOW(), NOW()),
('note-4', 'Prospective Member', 'Rosen family is new to Judaism. Very interested in learning and community involvement.', 'membership', 'family-4', NULL, NOW(), NOW()),
('note-5', 'Community Leader', 'Benjamin Weiss is leading technology initiatives for the synagogue. Very innovative approach.', 'leadership', 'family-5', 'member-13', NOW(), NOW());

-- Create some emails to show communication tracking
INSERT INTO emails (id, subject, content, "emailType", "sentDate", "familyId", "familyMemberId", "createdAt", "updatedAt") VALUES
('email-1', 'Welcome to Pilzno Synagogue', 'Welcome to our community! We are excited to have you join us.', 'welcome', '2024-01-15', 'family-1', NULL, NOW(), NOW()),
('email-2', 'Monthly Newsletter', 'This month''s community events and updates.', 'newsletter', '2024-02-01', 'family-1', NULL, NOW(), NOW()),
('email-3', 'Birthday Wishes', 'Happy Birthday Maya! We hope you have a wonderful day.', 'birthday', '2024-03-18', 'family-1', 'member-4', NOW(), NOW()),
('email-4', 'Community Event Invitation', 'You are invited to our annual community dinner.', 'event', '2024-12-01', 'family-1', NULL, NOW(), NOW());

-- Update family statistics
UPDATE families SET 
  "totalDonations" = (SELECT COALESCE(SUM(amount), 0) FROM donations WHERE "familyId" = families.id),
  "memberCount" = (SELECT COUNT(*) FROM family_members WHERE "familyId" = families.id AND "isActive" = true)
WHERE id IN ('family-1', 'family-2', 'family-3', 'family-4', 'family-5');

-- Display the created data
SELECT 'Families created:' as info, COUNT(*) as count FROM families
UNION ALL
SELECT 'Family members created:', COUNT(*) FROM family_members
UNION ALL
SELECT 'Life events created:', COUNT(*) FROM events
UNION ALL
SELECT 'Donations recorded:', COUNT(*) FROM donations
UNION ALL
SELECT 'Notes created:', COUNT(*) FROM notes
UNION ALL
SELECT 'Emails tracked:', COUNT(*) FROM emails;
