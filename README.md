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
  
  
Next, using "name" as key, normalizing the list of actors (into "cast)

```
FOR a IN off2016_actors 
    Collect name = a.name into instances
    let theName = FIRST(instances).a.name
    let theImage = FIRST(instances).a.image_path
    let fCol = (for i in instances return i.a.filmId)
    
    INSERT {name:theName, filmIds:fCol, image_path:theImage} IN off2016_cast
    return NEW
```


Now, the edge-collection "CastedInFilm" is created, so we can start modelling the relations. The 'filmIds' array on our off2016_cast collection is used to relate _cast vertices with _film vertices:

```
FOR c in off2016_cast
    for f in c.filmIds
        insert { _from: c._id, _to: CONCAT('off2016_films/',f) } in off2016_castedInFilm
```

Now the same process is done for films (remove dublettes) and awards won (using film title as key)


    
