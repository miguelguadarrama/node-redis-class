const redis = require("redis");
const { promisify } = require('util');

class Redis {
    constructor() {
        this.client = redis.createClient(6380, process.env.REDIS_HOST, { auth_pass: process.env.REDIS_KEY, tls: { servername: process.env.REDIS_HOST } });
        this.getAsync = promisify(this.client.get).bind(this.client);
        this.setAsync = promisify(this.client.set).bind(this.client);
        this.delAsync = promisify(this.client.del).bind(this.client);
    }

    fixToken(token) {
        //uncomment for hash
        //token = this.hashFnv32a(token)
        return `${process.env.ENVIRONMENT || 'NOENV'}:${process.env.REDIS_PREFIX || 'NP'}:${token}`
    }

    async setCache(token = false, value, time = 3600, context = null) {
        try {
            if (token === false) {
                throw "Invalid Token"
            }
            token = this.fixToken(token)
            //if(context) context.log("using hex: " + token);
            await this.setAsync(token, (typeof value === 'object' ? JSON.stringify(value) : value), 'EX', time);
            return true;
        } catch (ex) {
            if (context) {
                context.log(ex);
            }
            return false;
        }
    }

    async getFromCache(token = false, context = null) {
        try {
            if(token === false){
                throw "Invalid Token"
            }
            token = this.fixToken(token)
            if (context) context.log("using hex: " + token);
            const result = await this.getAsync(token);
            return result;
        } catch (ex) {
            //console.log("exception")
            //console.log(ex);
            return null;
        }
    }

    async del(token, context = null) {
        token = this.fixToken(token)
        try {
            return await this.delAsync(token)
        } catch (ex) {
            if(context) context.log("deleting token error", token)
            return false
        }
    }

    quit() {
        try {
            this.client.quit()
        } catch (ex) {

        }
    }
}

module.exports = Redis
