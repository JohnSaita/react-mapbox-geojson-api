# Load GeoJSON from an API into React + Mapbox (starter)

The broken version from the Geo Intelligence Lab video. It has three bugs:

1. `src/components/MapView.tsx`: every new response calls `addSource` again, so changing the magnitude throws `There is already a source with ID "quakes"` and the map never updates
2. `src/App.tsx`: nothing cancels the old request, so a slow response that lands last overwrites the one you asked for
3. `src/components/MapView.tsx`: the fly-to reads the coordinates as `[lat, lng]`, but GeoJSON is `[lng, lat]`, so picking a quake flies to the wrong place

Run it the same way as `final`, then fix each one along with the video.
