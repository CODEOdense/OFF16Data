# OFF16Data
ArangoDB data-backend for OFF16Hack

http://www.meetup.com/CODE-Odense/events/230846747/

This is a simple foxx-service (ArangoDB)

Checkout the swagger documentation



# Data-enrichment and Queries

Jesper munched some data from moviedb.org, and enriched the data we got from OFF.
Cast of films was added as array to each film

```
{
    "image_path": null,
    "cast_id": 8,
    "name": "Shuangbao Wang"
}
```

Normalizing this into seperate actor collection with graph-edges in AQL:

```
FOR f IN off2016_films FILTER HAS(f,"cast") && LENGTH(f.cast) > 0
    for c in f.cast
        INSERT {name:c.name, filmId:f._key, filmCastId:c.cast_id, image_path:c.image_path} IN off2016_actors
        return c
``` 
  
  
    
