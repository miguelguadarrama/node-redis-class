## How to use

Make sure to set this Env Variables:

**ENVIRONMENT**: will be used as prefix for redis key (pro/sta/dev)

**REDIS_PREFIX**: extra prefix after the ENVIRONMENT var

**REDIS_HOST**

**REDIS_KEY**

Will use secure port 6380, not configurable!

```javascript
const Redis = require('./redis')
// ...
const getData = async () => {
    const redis = new Redis();
    let cached = await redis.getFromCache(`MY_REDIS_OBJECT_KEY`);
    if(cached){
        cached = JSON.parse(cached);
        //...
        redis.quit();
        return cached
    }
    //if not cached...
    const data = { data: "my data" } //fetch from api or something
    await redis.setCache(`MY_REDIS_OBJECT_KEY`, data, 3600) //3600 time in seconds, optional
    redis.quit();
    return data
}
```