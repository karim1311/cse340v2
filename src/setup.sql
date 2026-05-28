CREATE TABLE organizations (
organization_id SERIAL PRIMARY KEY,
name VARCHAR(150) NOT NULL,
description TEXT NOT NULL,
contact_email VARCHAR(255) NOT NULL,
logo_filename VARCHAR(255) NOT NULL
);



-- =======================================
-- Insert sample data: Organizations
-- =====================================
INSERT INTO organizations (name, description, contact_email, logo_filename)
VALUES 
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainabality and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');




-- =======================================
-- Create table: Projects
-- =====================================
CREATE TABLE projects (
project_id SERIAL PRIMARY KEY,
organization_id INTEGER NOT NULL REFERENCES organization(organization_id),
title VARCHAR(150) NOT NULL,
description TEXT NOT NULL,
location VARCHAR(255) NOT NULL,
date DATE
);

-- =======================================
-- Insert sample data: Service Projects
-- =====================================
INSERT INTO projects (organization_id, title, description, location, date)
VALUES 
(1, 'Cleaning of Balboa Avenue.', 'Join McKinley High School in the cleaning of Balboa Avenue, we have cleaning materials, and food.', '165 Balboa Av,  24530, Manhattan, New York', '2026-08-01'),
(1, 'Free food in St. John Church', 'Help Catholic Church of Saint John deliver food to everyone who would like some, you can deliver food, help deliver packages, we can give you food also!', '4761 Pomodoro St,  24530, Cincinnatti, Ohio', '2026-08-07'),
(1, 'Donations of Clothes and Toys from Idaho State', 'Donate clothes and or toys to children in preparation for Thanksgiving! ', '165 Balboa Av, Pocatello, 11240, Idaho', '2026-08-15'),
(1, 'Beach Cleanup at Santa Monica Pier', 'Help volunteers clean the beach area around Santa Monica Pier. Gloves, trash bags, water, and snacks will be provided.', '200 Santa Monica Pier, Santa Monica, California, 90401', '2026-08-03'),
(1, 'Community Garden Restoration', 'Assist local residents with restoring the community garden by planting flowers, watering plants, and cleaning pathways.', '845 Green Valley Rd, Austin, Texas, 73301', '2026-08-05'),
(2, 'Food Bank Volunteer Day', 'Support the city food bank by organizing canned food, preparing boxes, and assisting families during distribution.', '710 Market St, Philadelphia, Pennsylvania, 19106', '2026-08-09'),
(2, 'Park Tree Planting Event', 'Join the environmental team to plant new trees and help improve the public park for the community.', '450 Lakeview Ave, Denver, Colorado, 80202', '2026-08-11'),
(2, 'Animal Shelter Assistance Program', 'Help clean animal areas, prepare food, and spend time with rescued dogs and cats waiting for adoption.', '912 Hope St, Portland, Oregon, 97205', '2026-08-13'),
(2, 'Senior Center Technology Help', 'Teach senior citizens how to use smartphones, messaging apps, and video calls during this volunteer event.', '300 River Rd, Tampa, Florida, 33602', '2026-08-16'),
(2, 'School Supplies Distribution', 'Assist teachers and volunteers in distributing backpacks and school supplies to children before the school year begins.', '1200 Lincoln Ave, Phoenix, Arizona, 85004', '2026-08-18'),
(3, 'Neighborhood Recycling Campaign', 'Help educate residents about recycling practices and assist with collection and sorting activities.', '88 Cedar St, Seattle, Washington, 98101', '2026-08-20'),
(3, 'Homeless Shelter Meal Service', 'Prepare and serve meals to individuals and families at the downtown homeless shelter.', '640 Maple Ave, Chicago, Illinois, 60605', '2026-08-22'),
(3, 'Library Book Organization Day', 'Volunteer at the public library helping organize donated books and prepare reading areas for children.', '77 Main St, Boston, Massachusetts, 02108', '2026-08-24'),
(3, 'River Cleanup Volunteer Event', 'Work with local environmental groups to remove trash and debris from the riverbank area.', '515 Riverside Dr, Nashville, Tennessee, 37203', '2026-08-27'),
(3, 'Youth Sports Coaching Support', 'Assist coaches during youth sports practice sessions and help organize activities for children.', '900 Sunset Blvd, San Diego, California, 92101', '2026-08-30')
;


-- =======================================
-- Create table: Categories
-- =====================================
CREATE TABLE categories (
category_id SERIAL PRIMARY KEY,
name VARCHAR(150) NOT NULL
);


-- =======================================
-- Create table: project_categories
-- =====================================
CREATE TABLE project_categories (
project_id INTEGER NOT NULL,
category_id INTEGER NOT NULL,

PRIMARY KEY (project_id, category_id),

FOREIGN KEY (project_id) REFERENCES projects(project_id),
FOREIGN KEY (category_id) REFERENCES categories(category_id)
);



-- =======================================
-- Insert sample data: Categories
-- =====================================
INSERT INTO categories (name)
VALUES 
('Community Service'),
('Educational'),
('Environmental'),
('Health and Wellness')
;

-- =======================================
-- Insert sample data: project_categories
-- =====================================
-- 1.- Community, 2. Educational 3. Environmental 4. Health and Wellness 5. Hunger
INSERT INTO project_categories (project_id, category_id)
VALUES 
(1,1),
(1,3),
(2,1),
(2,5),
(3,1),
(3,4),
(4,3),
(5,1),
(5,3),
(6,5),
(7,3),
(8,1),
(9,2),
(10,1),
(10,2),
(11,2),
(12,5),
(13,1),
(14,3),
(15,1);



