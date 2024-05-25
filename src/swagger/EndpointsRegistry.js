class EndpointsRegistry
{
    constructor()
    {
        this.healthcheck = null;
        this.docs = null;
    }

    /**
     * Set healthcheck path
     * @param {string} path
     */
    setHealthcheck(path)
    {
      this.healthcheck = path;
    }

    /**
     * Set docs path
     * @param {string} path
     */
    setDocs(path)
    {
      this.docs = path;
    }

    /**
     * Get healthcheck path
     * @returns {string|null}
     */
    getHealthcheck()
    {
      return this.healthcheck;
    }

    /**
     * Get docs path
     * @returns {string|null}
     */
    getDocs()
    {
      return this.docs;
    }

    /**
     * Get instance of EndpointsRegistry
     * @returns {EndpointsRegistry}
     */
    static getInstance()
    {
        if (!EndpointsRegistry.instance)
        {
            EndpointsRegistry.instance = new EndpointsRegistry();
        }
        return EndpointsRegistry.instance;
    }
}

module.exports = EndpointsRegistry.getInstance();
