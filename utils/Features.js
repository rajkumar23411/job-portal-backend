class Features {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filter() {
        const query = { ...this.queryString };
        const excludedFields = [
            "profile",
            "location",
            "workMode",
            "jobType",
            "page",
            "experience",
            "status",
            "jobTitle",
        ];
        excludedFields.forEach((el) => delete query[el]);

        let queryString = JSON.stringify(query);
        queryString = queryString.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );

        if (this.queryString.location) {
            const locations = this.queryString.location
                .split(",")
                .map((loc) => new RegExp(loc, "i"));
            this.query = this.query.where({
                locations,
            });
        }

        if (this.queryString.workMode) {
            this.query = this.query.where({
                workMode: this.queryString.workMode,
            });
        }

        if (this.queryString.jobType) {
            this.query = this.query.where({
                jobType: this.queryString.jobType,
            });
        }
        if (this.queryString.profile) {
            const profiles = this.queryString.profile.split(",");
            this.query = this.query.where({
                profile: { $in: profiles },
            });
        }

        if (this.queryString.experience) {
            const experience = new RegExp(this.queryString.experience, "i");
            this.query = this.query.where({
                experience,
            });
        }

        if (this.queryString.status) {
            const status = new RegExp(this.queryString.status, "i");
            this.query = this.query.where({
                status,
            });
        }

        this.query.find(JSON.parse(queryString));

        return this;
    }
}

export default Features;
