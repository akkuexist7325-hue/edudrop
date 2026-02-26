# Map Not Visible - Debugging Guide

## Quick Fixes Applied ✅

Your map should now be visible. The following improvements were made:

1. **Better CSS for map container** - Added `!important` flags and explicit display rules
2. **Google Maps callback** - Added callback function `onGoogleMapsReady()` to ensure map initializes when API loads
3. **Error handling** - Added retry logic in case Google Maps API takes time to load
4. **Better DOM checking** - Map container existence is verified before initialization

---

## How to Test the Map

### Step 1: Open the Test Page
Open this file in your browser:
- [test-map.html](test-map.html)

This page will show you:
- ✅ Status of API key detection
- ✅ Status of Google Maps API loading
- ✅ Status of map initialization
- ✅ A working test map

### Step 2: Check Your Main App
If the test map works, go back to your main app and click "TRACK ROUTE" on any teacher.

---

## If Map Still Doesn't Show - Troubleshooting

### Check 1: Browser Console
1. Open browser (Chrome/Firefox/Edge)
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Look for error messages

**Common errors:**

| Error | Solution |
|-------|----------|
| `Cannot read property 'Map' of undefined` | Google Maps API not loaded - check API key |
| `Maps API key is invalid` | API key is wrong or expired |
| `RefererNotAllowedMapError` | API key has domain restrictions |
| `MissingKeyMapError` | No API key provided |

### Check 2: API Key Validation

Open [index.html](index.html) and find line ~553:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBHwxvcGTe0y65riTRDc5DrK_YXKBW6YZQ&libraries=geometry,directions,places&callback=onGoogleMapsReady" async defer></script>
```

Your API key is: `AIzaSyBHwxvcGTe0y65riTRDc5DrK_YXKBW6YZQ`

**Verify on Google Cloud:**
1. Go to https://console.cloud.google.com/
2. Search for your project
3. Check if these APIs are **enabled**:
   - ✅ Maps JavaScript API
   - ✅ Directions API  
   - ✅ Places API

### Check 3: Network Issues

1. Open Browser DevTools (F12)
2. Go to **Network** tab
3. Reload the page
4. Look for `maps.googleapis.com` requests
5. Check if they return **Status 200** (success)

**If status is 403 or 4XX:**
- API key issue - may be revoked
- Domain restrictions - check if your domain is allowed

### Check 4: Map Container

The map needs a visible container with proper dimensions. 

In [index.html](index.html) line ~128, it should look like:
```html
<div id="map" class="shadow-xl rounded-2xl bg-slate-200 border-2 border-slate-100" style="height: 500px; width: 100%; border-radius: 1rem; overflow: hidden;"></div>
```

**Check that:**
- ✅ `id="map"` exists
- ✅ `height: 500px` is set
- ✅ `width: 100%` is set
- ✅ Container is visible (not hidden by CSS)

### Check 5: JavaScript Loaded

In [js/main.js](js/main.js), these functions must exist:
- `initializeMap()` - initializes the map
- `showTeacherLocation(teacherId)` - shows teacher marker
- `showRouteToTeacher(teacherId)` - shows route
- `initUberRoute(id)` - calls both above functions

In browser console, type:
```javascript
typeof initializeMap
```

Should return `"function"`. If it says `"undefined"`, the JavaScript didn't load.

---

## How It Works Now

### Before (when you click "TRACK ROUTE")
1. Google Maps API loads (`async defer`)
2. Page initializes
3. Script tries to use Google Maps
4. ❌ Could fail if API loads slowly

### After (with improvements)
1. Google Maps API loads with `callback=onGoogleMapsReady`
2. When API is ready, `onGoogleMapsReady()` is called
3. `onGoogleMapsReady()` calls `initializeMap()`
4. ✅ Map is guaranteed to be ready

---

## Manual Initialization

If the map still doesn't show, you can manually initialize it. In browser console, type:

```javascript
// Check if Google Maps is loaded
window.google ? console.log('✅ Maps loaded') : console.log('❌ Maps not loaded');

// Try to initialize the map
initializeMap();

// Check if map was created
map ? console.log('✅ Map created:', map) : console.log('❌ Map not created');
```

---

## Steps to Fix

### For Quick Testing:
1. ✅ Open [test-map.html](test-map.html) - Should show a working map
2. ✅ If test works, the API key is valid
3. ✅ If test fails, API key needs fixing

### For Fixing API Key Issues:
1. Go to https://console.cloud.google.com/
2. Create a **new** API key (don't worry, it's free)
3. Enable: Maps JavaScript API, Directions API, Places API
4. Copy the new key
5. Replace in [index.html](index.html) line ~553

---

## What Changed in Your Files

### [index.html](index.html)
- ✅ Added `!important` CSS to map styles
- ✅ Added `overflow: hidden` to map container
- ✅ Added `callback=onGoogleMapsReady` to Google Maps script
- ✅ Added `onGoogleMapsReady()` callback function

### [js/main.js](js/main.js)
- ✅ Enhanced `initializeMap()` with error checking
- ✅ Added Google Maps availability check
- ✅ Added console logging for debugging
- ✅ Improved initialization on page load

---

## Debug Mode

To enable detailed debugging, open browser console and type:

```javascript
// Force reinitialize map
map = null;
initializeMap();

// Test showing a teacher
showTeacherLocation(1); // Teacher ID 1

// Test showing route
showRouteToTeacher(1);
```

Check console for success/error messages.

---

## Expected Output

When map works correctly, you should see:

### In Browser Console:
```
✅ Main.js loaded successfully
✅ Google Maps API loaded successfully
✅ Map initialized successfully
```

### On Screen:
- Map container shows a street map of Kolkata
- Zoom controls visible in top-right
- Street View button visible
- When you click "TRACK ROUTE":
  - Blue marker appears at teacher's location
  - Route line shows path to teacher
  - Distance and time appear below map

---

## Still Not Working?

Try these in order:

1. **Clear browser cache** - `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
2. **Hard refresh** - `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
3. **Check console errors** - Open DevTools (F12) and look for red errors
4. **Test the test page** - Open [test-map.html](test-map.html)
5. **Get a new API key** - https://console.cloud.google.com/
6. **Check internet connection** - Maps need active internet

---

**Last Updated:** February 24, 2026
