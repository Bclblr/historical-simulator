# Map Foundation

Milestone 41 defines a period-independent geographic domain layer.

MapLocation represents a point relevant to the simulation and can be associated with an era, countries, institutions and historical events.

Supported semantic kinds include capitals, cities, regions, borders, institutions and event sites. Coordinates use validated latitude/longitude values.

The map model intentionally does not encode modern borders as timeless facts. Every location belongs to an era, and country associations are explicit. This allows later content packs to represent different historical periods without hard-coding 1933 or any single state into the engine.

This milestone is the data foundation only. Rendering, map artwork, interaction, historical boundary datasets and visual period styling belong to later UI/content work.
