# Google Maps Integration Guide

## Overview
The EduDrop app now includes Google Maps functionality to show teacher locations and calculate routes to their houses.

## Features Added

### 1. **Show Teacher Location on Map**
- When you click "TRACK ROUTE" button on any teacher card, the map displays:
  - Teacher's exact location (blue marker)
  - Teacher's name, subject, and monthly fee in an info window
  - Map automatically centers on the teacher's location

### 2. **Calculate Route & Distance**
- Automatically calculates the driving route from your location to the teacher's house
- Displays:
  - Distance in kilometers
  - Estimated travel time in minutes
  - Visual route on the map with directions

### 3. **Interactive Map Features**
- Zoom, pan, and rotate the map
- Click on teacher marker to view details
- Fullscreen mode available
- Toggle between map types (satellite, terrain, etc.)

## Setup Instructions

### Step 1: Get a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable these APIs:
   - **Maps JavaScript API**
   - **Directions API**
   - **Places API**
4. Go to "Credentials" and create an API key
5. Restrict your API key to:
   - HTTP referrers (add your domain)
   - Enable JavaScript API services

### Step 2: Add Your API Key

In `index.html`, find line 551 and replace:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=geometry,directions,places" async defer></script>
```

Replace `YOUR_API_KEY` with your actual Google Maps API key:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDpxxxxxXXXXXX&libraries=geometry,directions,places" async defer></script>
```

### Step 3: Set Your Default Location

By default, the user location is set to Kolkata coordinates (22.5726, 88.3639).

To change this, edit `js/main.js` in the `showRouteToTeacher()` function:
```javascript
const userLocation = { lat: 22.5726, lng: 88.3639 };
```

Replace with your city coordinates. Find coordinates on [Google Maps](https://maps.google.com).

## How It Works

### Data Structure
Each teacher has location coordinates:
```javascript
{
    id: 1,
    name: "Dr. Alok Verma",
    lat: 22.5726,      // Latitude
    lng: 88.3639,      // Longitude
    // ... other properties
}
```

### Function Calls

**When "TRACK ROUTE" is clicked:**
1. `initUberRoute(teacherId)` is called
2. This calls:
   - `showTeacherLocation(teacherId)` - Displays teacher marker
   - `showRouteToTeacher(teacherId)` - Calculates and shows route

**Map Functions Available:**
- `initializeMap()` - Initializes the Google Map
- `showTeacherLocation(teacherId)` - Shows only teacher location
- `showRouteToTeacher(teacherId)` - Shows route from user to teacher

## Features of the Integration

### Visual Elements
- 🔵 Blue marker for teacher location
- 📍 Route line showing driving path
- 📏 Distance calculation
- ⏱️ Time estimation
- 📋 Info window with teacher details

### Information Displayed
```
Teacher's House Location
├── Name: Dr. Alok Verma
├── Subject: Physics
├── Fee: ₹4000/month
└── Distance & Time to reach
```

### Route Stats Box
Shows:
- Total distance in kilometers
- Estimated travel time in minutes
- Updates dynamically based on route

## Customization Options

### 1. Change Map Theme
Edit `initializeMap()` to add custom styling:
```javascript
const mapOptions = {
    styles: [ /* custom style array */ ],
    // ... other options
};
```

### 2. Change Marker Icons
Modify the teacher marker in `showTeacherLocation()`:
```javascript
icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' // or your custom icon URL
```

### 3. Add Multiple Routes
You can modify `showRouteToTeacher()` to show alternative routes:
```javascript
directionsService.route({
    alternatives: true, // Show alternative routes
    // ... other options
});
```

## Troubleshooting

### "Map not loading" error
- Check if Google Maps API key is valid
- Verify API key has these services enabled:
  - Maps JavaScript API
  - Directions API

### "Route calculation fails"
- Ensure both start and end coordinates are valid
- Check if location is within Google Maps coverage area

### "Marker not showing"
- Verify teacher has valid lat/lng coordinates
- Check browser console for JavaScript errors

## Testing

### Test Data
The app comes with 2 sample teachers:
1. **Dr. Alok Verma** - Physics (lat: 22.5726, lng: 88.3639)
2. **Sarah Khan** - Calculus (lat: 22.5950, lng: 88.4100)

Click "TRACK ROUTE" on any teacher to see the map in action.

## Browser Compatibility
- ✅ Chrome/Edge - Full support
- ✅ Firefox - Full support
- ✅ Safari - Full support
- ✅ Mobile browsers - Full support

## API Quotas & Limits
- Free tier includes 1000 map loads/day
- Each route calculation counts as 1 API call
- Monitor usage in Google Cloud Console

## Security Notes
- ⚠️ Never commit API keys to public repositories
- Use environment variables in production
- Restrict API key to specific domains
- Monitor for unauthorized usage

---

**Last Updated:** February 2026
**Version:** 1.0
