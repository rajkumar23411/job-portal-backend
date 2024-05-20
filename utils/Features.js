class Features {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filter() {
        const query = { ...this.queryString };
        const excludedFields = [
            "page",
            "profile",
            "location",
            "keyword",
            "workMode",
            "jobType",
        ];
        excludedFields.forEach((el) => delete query[el]);

        let queryString = JSON.stringify(query);
        queryString = queryString.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );

        if (this.queryString.location) {
            const locations = this.queryString.location.split(",");
            this.query = this.query.where({ locations: { $in: locations } });
        }

        if (this.queryString.workMode) {
            this.query = this.query.where({ workMode: this.queryString.mode });
        }

        if (this.queryString.jobType) {
            this.query = this.query.where({
                jobType: this.queryString.jobType,
            });
        }
        if (this.queryString.profile) {
        }

        this.query.find(JSON.parse(queryString));

        return this;
    }
}

export default Features;
