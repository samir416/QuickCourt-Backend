# QuickCourt – Local Sports Booking Platform

QuickCourt is a full-stack web application for discovering, booking, and managing local sports facilities.

The platform enables sports enthusiasts to find approved sports venues, explore available courts, check pricing and availability, book time slots, manage their bookings, and participate in a local sports community.

The application also provides dedicated workflows for Facility Owners and Administrators to manage facilities, courts, bookings, users, approvals, and platform operations.

QuickCourt was developed as a pre-project for a hackathon based on the provided "QuickCourt - A Local Sports Booking" problem statement.

---

## Problem Statement

QuickCourt is designed to provide an end-to-end digital experience for local sports facility booking.

The platform focuses on:

- Discovering local sports venues
- Searching and filtering facilities
- Viewing detailed venue information
- Checking available courts and time slots
- Booking sports courts
- Managing bookings
- Supporting facility owners
- Providing administrative management
- Supporting community-oriented sports features
- Providing dashboards and booking analytics

The application follows a role-based architecture with separate experiences for Players, Facility Owners, and Administrators.

---

## Core User Roles

QuickCourt supports three primary roles:

### Player

Players can:

- Browse approved sports venues
- Search for venues
- Filter venues
- View venue details
- View available sports
- View courts and pricing
- Select date and time slots
- Book courts
- View booking history
- Cancel eligible bookings
- Manage their profile
- Access player-specific features
- Participate in matches/community-related functionality

### Facility Owner

Facility Owners can:

- Access an owner dashboard
- Manage facilities
- Manage courts
- Configure court availability
- Block time slots
- Manage bookings
- View booking information
- Manage facility information
- Manage owner profile
- View operational statistics and analytics

### Administrator

Administrators can:

- Access the admin dashboard
- View global platform statistics
- Manage users
- Manage facility owners
- Review facility registrations
- Approve or reject facilities
- View facility details and submitted information
- Manage reported users or facilities where applicable
- Manage administrative workflows
- Manage administrator profile

---

# Features

## Authentication & Authorization

- User registration
- User login
- User logout
- Role-based authentication
- Role-based navigation
- Protected application routes
- Player-specific access
- Facility Owner-specific access
- Administrator-specific access
- Profile/avatar support
- Secure password handling
- Backend authorization using Spring Security

---

# Player Features

## Home Page

The Home Page provides quick access to important areas of the platform.

Features include:

- Welcome section
- Sports discovery
- Popular venues
- Popular sports
- Quick navigation
- Venue discovery
- Search functionality
- Access to booking-related workflows

---

## Venues Page

The Venues Page displays approved sports facilities.

Users can:

- View available venues
- Search for venues
- Filter venues
- Browse sports facilities
- Explore venue information
- Navigate to individual venue details

Venue cards can display:

- Venue name
- Sport type
- Starting price per hour
- Short location
- Rating where implemented
- Venue-related information

Supported filtering concepts include:

- Sport type
- Price
- Venue type
- Rating

Pagination can be used for larger venue datasets.

---

## Single Venue Page

The Single Venue Page provides detailed information about a selected facility.

Information includes:

- Venue name
- Description
- Address
- Available sports
- Amenities
- About the venue
- Venue images/photos
- Reviews section where implemented
- Available courts
- Booking access

Primary action:

- Book Now

---

## Court Booking

Players can book a court by selecting:

- Venue
- Court
- Sport
- Date
- Available time slot

The booking flow provides:

- User information
- Court information
- Selected date
- Selected time slot
- Price per hour
- Total booking amount
- Booking confirmation
- Booking status

The payment flow is simulated for the current application.

After successful booking, the user can be redirected to the My Bookings section.

---

## My Bookings

The My Bookings page allows players to view their booking history.

Each booking can display:

- Venue name
- Sport type
- Court name
- Booking date
- Booking time
- Booking amount
- Booking status

Possible booking statuses include:

- Confirmed
- Cancelled
- Completed

Eligible future bookings can provide:

- Cancel booking

Optional filtering can be implemented using:

- Date
- Booking status

---

## Player Profile

The Profile Page allows players to view and update their basic information.

Profile information includes:

- Name
- Email
- Profile information
- Avatar/profile image where supported

---

## Matches & Community

QuickCourt also provides navigation and functionality related to local sports matches/community engagement.

This provides a foundation for future features such as:

- Creating matches
- Joining matches
- Finding other players
- Community participation
- Sports-based interactions

---

# Facility Owner Features

## Owner Dashboard

The Facility Owner Dashboard provides an overview of facility operations.

Dashboard information can include:

- Total bookings
- Active courts
- Earnings simulation
- Booking trends
- Booking activity
- Operational statistics

Analytics can include:

- Daily booking trends
- Weekly booking trends
- Monthly booking trends
- Earnings summary
- Peak booking hours

Charts can be represented using:

- Line charts
- Bar charts
- Doughnut charts
- Area charts
- Heatmap-style visualizations where implemented

---

## Facility Management

Facility Owners can manage their sports facilities.

Facility information can include:

- Facility name
- Location
- Description
- Supported sports
- Amenities
- Facility images
- Operating information

Facility management workflows include:

- Add facility
- Edit facility
- View facility
- Manage facility information

Facility approval is handled through the Administrator workflow.

---

## Court Management

Facility Owners can manage courts associated with their facilities.

Court information can include:

- Court name
- Sport type
- Pricing per hour
- Operating hours
- Availability

Court management supports:

- Add court
- Edit court
- Delete court
- View court
- Manage court information

---

## Time Slot Management

Facility Owners can manage court availability.

Features include:

- Configure availability
- Manage operating hours
- Block unavailable time slots
- Block slots for maintenance
- Manage booking availability

This helps prevent conflicting or unavailable bookings.

---

## Booking Overview

Facility Owners can view upcoming and previous bookings.

Booking information can include:

- User name
- Venue
- Court
- Sport
- Date
- Time
- Booking status
- Booking amount

Possible statuses include:

- Booked
- Cancelled
- Completed

---

## Owner Profile

Facility Owners can:

- View owner information
- Update basic profile information
- Manage profile details
- Manage profile/avatar information where supported

---

# Administrator Features

## Admin Dashboard

The Administrator Dashboard provides global platform statistics.

Dashboard metrics can include:

- Total users
- Total facility owners
- Total bookings
- Total active courts
- Platform activity

Analytics can include:

- Booking activity over time
- User registration trends
- Facility approval trends
- Most active sports
- Earnings simulation

Charts can include:

- Line charts
- Bar charts
- Doughnut charts
- Area charts

---

## Facility Approval

Administrators can review facility registrations submitted by facility owners.

The approval workflow can include:

- View pending facilities
- View facility details
- Review submitted information
- Review facility photos
- Approve facility
- Reject facility
- Provide optional comments where supported

Only approved facilities are intended to become available for normal player discovery and booking.

---

## User Management

Administrators can view and manage users and facility owners.

User management can include:

- View users
- Search users
- Filter users
- Filter by role
- Filter by status
- View user information
- View booking history
- Ban users
- Unban users

---

## Reports & Moderation

The architecture provides support for administrative moderation workflows.

Where implemented, administrators can:

- View user reports
- Review reported facilities
- Review reported users
- Take appropriate administrative action

This area can be extended as the platform grows.

---

## Admin Profile

Administrators can:

- View profile information
- Update basic information
- Manage profile details

---

# Technology Stack

## Frontend

- React
- Vite
- React Router DOM
- Axios
- Lucide React
- Recharts
- JavaScript / JSX
- CSS
- Responsive Web Design

## Backend

- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- REST APIs
- Maven

## Database

- MySQL

## API Development & Testing

- Postman

Postman was used during development to test and verify backend REST APIs, request/response behavior, authentication flows, and API endpoints.

## Development Environment

- Visual Studio Code
- Git
- GitHub
- MySQL
- Postman

---

# Application Architecture

QuickCourt follows a client-server architecture.

```text
                         QUICKCOURT
                             |
              ┌──────────────┴──────────────┐
              │                             │
          FRONTEND                       BACKEND
           React                       Spring Boot
           Vite                        Spring Security
           Axios                       Spring Data JPA
           CSS                         REST APIs
              │                             │
              │          HTTP/REST          │
              └──────────────┬──────────────┘
                             │
                           MySQL
                          Database